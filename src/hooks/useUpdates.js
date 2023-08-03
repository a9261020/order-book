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
          updateHandler([...rawAsks.value, ...asks], rawAsks);
        }

        if (bids.length > 0) {
          updateHandler([...rawBids.value, ...bids], rawBids);
        }
      }

      localSeqNum = seqNum;
    }
  };

  const updateHandler = (currentLevels, prevLevels) => {
    currentLevels.forEach(level => {
      const [price, size] = level;

      // If new size is zero - delete the price level
      if (size === '0') {
        prevLevels.value = removePriceLevel(price, prevLevels.value);
      } else {
        // If the price level exists and the size is not zero, update it
        if (levelExists(price, prevLevels.value)) {
          prevLevels.value = updatePriceLevel(level, prevLevels.value);
        } else {
          // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
          prevLevels.value = addPriceLevel(level, prevLevels.value);
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
