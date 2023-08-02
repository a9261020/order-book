import { ref } from 'vue';
import useWs from './useWs';
const endpoint = 'wss://ws.btse.com/ws/oss/futures';

export const useUpdates = (market = '') => {
  const updateBids = ref([]);
  const updateAsks = ref([]);
  const currentBids = ref([]);
  const currentAsks = ref([]);

  const openHandler = () => {
    const subscribeMsg = {
      op: 'subscribe',
      args: [`update:${market}`],
    };

    orderBookWs.send(JSON.stringify(subscribeMsg));
  };

  const msgHandler = evt => {
    const res = JSON.parse(evt.data);

    if (res?.data) {
      const { bids, asks, seqNum, prevSeqNum, type, symbol } = res.data;

      if (type === 'snapshot') {
        const initAsks = asks.slice(42);
        const initBids = bids.slice(0, 8);
        updateAsks.value = initAsks;
        updateBids.value = initBids;
      } else {
        if (asks.length > 0) {
          currentAsks.value = [...updateAsks.value, ...asks];

          updateAsksHandler(currentAsks.value);
          currentAsks.value = [];
        }

        if (bids.length > 0) {
          currentBids.value = [...updateBids.value, ...bids];

          updateBidsHandler(currentBids.value);
          currentBids.value = [];
        }
      }
    }
  };

  const removePriceLevel = (price, items) => {
    return items.filter(item => item[0] !== price);
  };

  const levelExists = (price, currentLevels) => {
    return currentLevels.some(level => level[0] === price);
  };

  const updatePriceLevel = (bid, levels) => {
    return levels.map(level => {
      if (level[0] === bid[0]) {
        level = bid;
      }
      return level;
    });
  };

  const addPriceLevel = (deltaLevel, levels) => {
    return [...levels, deltaLevel];
  };

  const updateBidsHandler = newUpdateBids => {
    newUpdateBids.forEach(bid => {
      const [price, size] = bid;

      // If new size is zero - delete the price level
      if (size === '0') {
        updateBids.value = removePriceLevel(price, updateBids.value);
      } else {
        // If the price level exists and the size is not zero, update it
        if (levelExists(price, updateBids.value)) {
          updateBids.value = updatePriceLevel(bid, updateBids.value);
        } else {
          // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
          updateBids.value = addPriceLevel(bid, updateBids.value);
        }
      }
    });
  };

  const updateAsksHandler = newUpdateAsks => {
    newUpdateAsks.forEach(bid => {
      const [price, size] = bid;

      // If new size is zero - delete the price level
      if (size === '0') {
        updateAsks.value = removePriceLevel(price, updateAsks.value);
      } else {
        // If the price level exists and the size is not zero, update it
        if (levelExists(price, updateAsks.value)) {
          updateAsks.value = updatePriceLevel(bid, updateAsks.value);
        } else {
          // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
          updateAsks.value = addPriceLevel(bid, updateAsks.value);
        }
      }
    });
  };

  const { ws: orderBookWs } = useWs(endpoint, {
    onOpen: openHandler,
    onMessage: msgHandler,
  });

  return {
    updateBids,
    updateAsks,
  };
};
