<template>
  <ul :class="`${quoteType === 'ask' ? 'sell' : 'buy'}-list`">
    <li v-for="level in levelList" :class="[levelClass(level[2])]">
      <span :class="`${quoteType}-price`">
        {{ formatNumber(level[0], 1) }}
      </span>
      <span :class="`${quoteType}-size size-${level[2]}`">
        {{ formatNumber(level[1]) }}
      </span>
      <div :class="`${quoteType}-total`">
        <span
          class="accumulative-bar"
          :style="{
            left: calcAccumulativeBar(level[3], levelList),
          }"
        />
        {{ formatNumber(level[3]) }}
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { formatNumber } from '../utils/Utils';

export default {
  name: 'Levels',
  props: {
    levels: {
      type: Array,
    },
    quote: {
      type: String,
    },
  },
  setup(props) {
    const quoteType = props.quote === '0' ? 'ask' : 'bid';
    const levelClass = trend => {
      let sizeTrend = '';
      if (trend === 'new') {
        sizeTrend = quoteType === 'ask' ? 'decrease' : 'increase';
      }

      return {
        [quoteType]: true,
        [`size-${sizeTrend}`]: true,
      };
    };
    const levelList = computed(() => {
      let cumulativeSum = 0;
      const sortedAndSlicedLevels = props.levels
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 8);

      return props.quote === '0'
        ? sortedAndSlicedLevels.map((entry, index, arr) => {
            const accumulatedValue = arr
              .slice(index)
              .reduce((acc, curr) => acc + parseInt(curr[1]), 0);

            return [...entry, accumulatedValue];
          })
        : sortedAndSlicedLevels.map(item => {
            const secondValue = parseInt(item[1], 10);
            cumulativeSum += secondValue;
            return [...item, cumulativeSum.toString()];
          });
    });

    const calcAccumulativeBar = (level, levelList) => {
      const total = quoteType === 'ask' ? +levelList[0][3] : +levelList[7][3];
      return `${100 - (+level / total) * 100}%`;
    };

    return {
      quoteType,
      levelClass,
      levelList,
      formatNumber,
      calcAccumulativeBar,
    };
  },
};
</script>
