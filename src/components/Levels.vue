<template>
  <ul :class="`${quoteType === 'ask' ? 'sell' : 'buy'}-list`">
    <li
      v-for="level in levelList"
      :class="{
        [quoteType]: true,
        'size-decrease': level[2] === 'new',
      }"
    >
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
            left:
              quoteType === 'ask'
                ? calcAccumulativeBar(level[3], levelList[0][3])
                : calcAccumulativeBar(level[3], levelList[7][3]),
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

    const calcAccumulativeBar = (current, total) =>
      `${100 - (+current / +total) * 100}%`;

    return {
      quoteType,
      levelList,
      formatNumber,
      calcAccumulativeBar,
    };
  },
};
</script>
