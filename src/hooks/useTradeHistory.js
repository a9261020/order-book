import { ref } from 'vue';
import useWs from './useWs';
const endpoint = 'wss://ws.btse.com/ws/futures';
import { HISTORY_TREND_MAP } from '../constant/constant';

export const useTradeHistory = (market = '') => {
  const currentLastPrice = ref({
    price: '0',
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

      if (currentLastPrice.value.price === '0') {
        currentLastPrice.value.trend = HISTORY_TREND_MAP.SAME;
        currentLastPrice.value.price = lastPrice.price;
        return;
      }

      if (currentLastPrice.value.price > lastPrice.price) {
        currentLastPrice.value.trend = HISTORY_TREND_MAP.DECREASE;
      } else if (currentLastPrice.value.price < lastPrice.price) {
        currentLastPrice.value.trend = HISTORY_TREND_MAP.INCREASE;
      } else {
        currentLastPrice.value.trend = HISTORY_TREND_MAP.SAME;
      }

      currentLastPrice.value.price = lastPrice.price;
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
