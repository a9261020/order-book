<template>
  <ul :class="`list ${quoteType}`">
    <li
      v-for="level in levelList"
      class="level"
      :class="[levelClass(level[2])]"
    >
      <span class="price">
        {{ formatNumber(level[0], 1) }}
      </span>
      <span class="size" :class="`size-${level[2]}`">
        {{ formatNumber(level[1]) }}
      </span>
      <div class="total">
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
import { computed, toRefs } from 'vue';
import { formatNumber } from '../utils/Utils';

export default {
  name: 'Levels',
  props: {
    levels: {
      type: Array,
    },
    quoteType: {
      type: String,
    },
  },
  setup(props) {
    const { levels, quoteType } = toRefs(props);
    const levelClass = trend => {
      let sizeTrend = '';
      if (trend === 'new') {
        sizeTrend = quoteType.value === 'ask' ? 'decrease' : 'increase';
      }

      return {
        [`size-${sizeTrend}`]: true,
      };
    };
    const levelList = computed(() => {
      let cumulativeSum = 0;
      const sortedAndSlicedLevels = levels.value
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 8);

      return quoteType.value === 'ask'
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
      const total =
        quoteType.value === 'ask' ? +levelList[0][3] : +levelList[7][3];
      return `${100 - (+level / total) * 100}%`;
    };

    return {
      levelClass,
      levelList,
      formatNumber,
      calcAccumulativeBar,
    };
  },
};
</script>
