<template>
  <div class="container">
    <h1 class="order-book">Order Book</h1>
    <div class="title">
      <span class="title-price">Price (USD)</span>
      <span class="title-size">Size</span>
      <span class="title-total">Total</span>
    </div>
    <Levels
      v-if="isNotEmptyArray(rawAsks[0])"
      :levels="rawAsks"
      quoteType="ask"
    />
    <div class="last-price" :class="currentLastPrice.trend">
      {{ formatNumber(currentLastPrice.price, 1) }}
      <div v-show="currentLastPrice.trend !== 'same'" class="icon">
        <SvgIcon iconClass="arrow" />
      </div>
    </div>
    <Levels
      v-if="isNotEmptyArray(rawBids[0])"
      :levels="rawBids"
      quoteType="bid"
    />
  </div>
</template>

<script>
import { useUpdates } from './hooks/useUpdates';
import { useTradeHistory } from './hooks/useTradeHistory';
import { formatNumber, isNotEmptyArray } from './utils/Utils';
import { MARKET } from './constant/constant';
import SvgIcon from './components/SvgIcon.vue';
import Levels from './components/Levels.vue';

export default {
  name: 'App',
  components: {
    SvgIcon,
    Levels,
  },
  setup() {
    const { currentLastPrice } = useTradeHistory(MARKET);
    const { rawAsks, rawBids } = useUpdates(MARKET);

    return {
      rawAsks,
      rawBids,
      isNotEmptyArray,
      formatNumber,
      currentLastPrice,
    };
  },
};
</script>
