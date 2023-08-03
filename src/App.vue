<template>
  <div class="container">
    <h1 class="order-book">Order Book</h1>
    <div class="title">
      <span class="title-price">Price (USD)</span>
      <span class="title-size">Size</span>
      <span class="title-total">Total</span>
    </div>
    <Levels v-if="rawAsks[0]" :levels="rawAsks" quote="0" />
    <div class="last-price" :class="currentLastPrice.trend">
      {{ formatNumber(currentLastPrice.value.price, 1) }}
      <div v-show="currentLastPrice.trend !== 'same'" class="icon">
        <SvgIcon iconClass="arrow" />
      </div>
    </div>
    <Levels v-if="rawBids[0]" :levels="rawBids" quote="1" />
    <!-- <ul class="buy-list">
      <li
        v-for="bid in bidsList"
        class="bid"
        :class="{ 'size-increase': bid[2] === 'new' }"
      >
        <span class="bid-price">
          {{ formatNumber(bid[0], 1) }}
        </span>
        <span class="bid-size" :class="`size-${bid[2]}`">
          {{ formatNumber(bid[1]) }}
        </span>
        <div class="bid-total">
          <span
            class="accumulative-bar"
            :style="{
              left: calcAccumulativeBar(bid[3], bidsList[7][3]),
            }"
          />
          {{ formatNumber(bid[3]) }}
        </div>
      </li>
    </ul> -->
  </div>
</template>

<script>
import { useUpdates } from './hooks/useUpdates';
import { useTradeHistory } from './hooks/useTradeHistory';
import { formatNumber } from './utils/Utils';
import SvgIcon from './components/SvgIcon.vue';
import Levels from './components/Levels.vue';

export default {
  name: 'App',
  components: {
    SvgIcon,
    Levels,
  },
  setup() {
    const market = 'BTCPFC';
    const { currentLastPrice } = useTradeHistory(market);
    const { rawAsks, rawBids } = useUpdates(market);

    return {
      rawAsks,
      rawBids,
      formatNumber,
      currentLastPrice,
    };
  },
};
</script>
