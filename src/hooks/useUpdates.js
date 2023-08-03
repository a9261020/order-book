import { ref } from 'vue';
import useWs from './useWs';
const endpoint = 'wss://ws.btse.com/ws/oss/futures';
import {
  removePriceLevel,
  addPriceLevel,
  updatePriceLevel,
  levelExists,
} from '../utils/Utils';

export const useUpdates = (market = '') => {
  const rawBids = ref([]);
  const rawAsks = ref([]);
  let currentBids = [];
  let currentAsks = [];
  let localSeqNum = 0;

  const openHandler = (isInit = true) => {
    const msg = {
      op: isInit ? 'subscribe' : 'unsubscribe',
      args: [`update:${market}`],
    };

    orderBookWs.send(JSON.stringify(msg));
  };

  const msgHandler = evt => {
    const res = JSON.parse(evt.data);

    if (res?.data) {
      const { bids, asks, seqNum, prevSeqNum, type } = res.data;

      if (localSeqNum !== 0 && localSeqNum !== prevSeqNum) {
        openHandler(false);
        openHandler();
      }

      if (type === 'snapshot') {
        const initAsks = asks.slice(-8).map(item => [...item, 'new']);
        const initBids = bids.slice(0, 8).map(item => [...item, 'new']);
        rawAsks.value = initAsks;
        rawBids.value = initBids;
      } else {
        if (asks.length > 0) {
          currentAsks = [...rawAsks.value, ...asks];

          updateAsksHandler(currentAsks);
          currentAsks = [];
        }

        if (bids.length > 0) {
          currentBids = [...rawBids.value, ...bids];

          updateBidsHandler(currentBids);
          currentBids = [];
        }
      }

      localSeqNum = seqNum;
    }
  };

  const updateBidsHandler = newUpdateBids => {
    newUpdateBids.forEach(bid => {
      const [price, size] = bid;

      // If new size is zero - delete the price level
      if (size === '0') {
        rawBids.value = removePriceLevel(price, rawBids.value);
      } else {
        // If the price level exists and the size is not zero, update it
        if (levelExists(price, rawBids.value)) {
          rawBids.value = updatePriceLevel(bid, rawBids.value);
        } else {
          // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
          rawBids.value = addPriceLevel(bid, rawBids.value);
        }
      }
    });
  };

  const updateAsksHandler = newUpdateAsks => {
    newUpdateAsks.forEach(bid => {
      const [price, size] = bid;

      // If new size is zero - delete the price level
      if (size === '0') {
        rawAsks.value = removePriceLevel(price, rawAsks.value);
      } else {
        // If the price level exists and the size is not zero, update it
        if (levelExists(price, rawAsks.value)) {
          rawAsks.value = updatePriceLevel(bid, rawAsks.value);
        } else {
          // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
          rawAsks.value = addPriceLevel(bid, rawAsks.value);
        }
      }
    });
  };

  const { ws: orderBookWs } = useWs(endpoint, {
    onOpen: openHandler,
    onMessage: msgHandler,
  });

  return {
    rawBids,
    rawAsks,
  };
};
