import { ref } from 'vue';
import useWs from './useWs';
const endpoint = 'wss://ws.btse.com/ws/futures';
const TREND = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  SAME: 'same',
};

export const useTradeHistory = (market = '') => {
  const currentLastPrice = ref({
    value: '0',
    trend: '',
  });

  const openHandler = () => {
    const subscribeMsg = {
      op: 'subscribe',
      args: [`tradeHistoryApi:${market}`],
    };

    tradeHistoryWs.send(JSON.stringify(subscribeMsg));
  };

  const msgHandler = evt => {
    const res = JSON.parse(evt.data);

    if (res?.data) {
      const [lastPrice] = res.data;
      console.log('lastPrice ->', lastPrice);

      if (currentLastPrice.value.value === '0') {
        currentLastPrice.value.trend = TREND.SAME;
        currentLastPrice.value.value = lastPrice;
        return;
      }

      if (currentLastPrice.value.value.price > lastPrice.price) {
        currentLastPrice.value.trend = TREND.DECREASE;
      } else if (currentLastPrice.value.value.price < lastPrice.price) {
        currentLastPrice.value.trend = TREND.INCREASE;
      } else {
        currentLastPrice.value.trend = TREND.SAME;
      }

      currentLastPrice.value.value = lastPrice;
    }
  };

  const { ws: tradeHistoryWs } = useWs(endpoint, {
    onOpen: openHandler,
    onMessage: msgHandler,
  });

  return {
    currentLastPrice,
  };
};
