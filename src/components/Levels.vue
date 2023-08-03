<template>
  <ul class="sell-list">
    <li
      v-for="level in levelList"
      class="ask"
      :class="{ 'size-decrease': level[2] === 'new' }"
    >
      <span class="ask-price">
        {{ formatNumber(level[0], 1) }}
      </span>
      <span class="ask-size" :class="`size-${level[2]}`">
        {{ formatNumber(level[1]) }}
      </span>
      <div class="ask-total">
        <span
          class="accumulative-bar"
          :style="{
            left: calcAccumulativeBar(level[3], levelList[0][3]),
          }"
        />
        {{ formatNumber(level[3]) }}
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'Levels',
  props: {
    levels: Array,
  },
  setup(props) {
    const { levels } = props;

    const levelList = computed(() => {
      return levels.value
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 8)
        .map((entry, index, arr) => {
          const accumulatedValue = arr
            .slice(index)
            .reduce((acc, curr) => acc + parseInt(curr[1]), 0);

          return [...entry, accumulatedValue];
        });
    });

    const formatNumber = (value, minimumFractionDigits = 0) => {
      const numberValue = +value;
      return numberValue.toLocaleString('en-US', {
        minimumFractionDigits,
      });
    };

    const calcAccumulativeBar = (current, total) =>
      `${100 - (+current / +total) * 100}%`;

    return {
      levelList,
      formatNumber,
      calcAccumulativeBar,
    };
  },
};
</script>
