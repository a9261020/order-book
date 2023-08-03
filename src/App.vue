<template>
  <div class="container">
    <h1 class="order-book">Order Book</h1>
    <div class="title">
      <span class="title-price">Price (USD)</span>
      <span class="title-size">Size</span>
      <span class="title-total">Total</span>
    </div>
    <ul class="sell-list">
      <li
        v-for="ask in asksList"
        class="ask"
        :class="{ 'size-decrease': ask[2] === 'new' }"
      >
        <span class="ask-price">
          {{ formatNumber(ask[0], 1) }}
        </span>
        <span class="ask-size" :class="`size-${ask[2]}`">
          {{ formatNumber(ask[1]) }}
        </span>
        <div class="ask-total">
          <span
            class="accumulative-bar"
            :style="{
              left: calcAccumulativeBar(ask[3], asksList[0][3]),
            }"
          />
          {{ formatNumber(ask[3]) }}
        </div>
      </li>
    </ul>
    <div class="last-price" :class="currentLastPrice.trend">
      {{ formatNumber(currentLastPrice.value.price, 1) }}
      <div v-show="currentLastPrice.trend !== 'same'" class="icon">
        <SvgIcon iconClass="arrow" />
      </div>
    </div>
    <ul class="buy-list">
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
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useUpdates } from './hooks/useUpdates';
import { useTradeHistory } from './hooks/useTradeHistory';
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
    const formatNumber = (value, minimumFractionDigits = 0) => {
      const numberValue = +value;
      return numberValue.toLocaleString('en-US', {
        minimumFractionDigits,
      });
    };
    const calcAccumulativeBar = (current, total) =>
      `${100 - (+current / +total) * 100}%`;
    const asksList = computed(() => {
      return rawAsks.value
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 8)
        .map((entry, index, arr) => {
          const accumulatedValue = arr
            .slice(index)
            .reduce((acc, curr) => acc + parseInt(curr[1]), 0);

          return [...entry, accumulatedValue];
        });
    });
    const bidsList = computed(() => {
      let cumulativeSum = 0;

      return rawBids.value
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 8)
        .map(item => {
          const secondValue = parseInt(item[1], 10);
          cumulativeSum += secondValue;
          return [...item, cumulativeSum.toString()];
        });
    });

    return {
      asksList,
      bidsList,
      formatNumber,
      calcAccumulativeBar,
      currentLastPrice,
    };
  },
};
</script>
