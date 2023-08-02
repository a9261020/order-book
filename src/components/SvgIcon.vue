<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: () => '',
  },
});

const iconName = computed(() => {
  return `#icon-${props.iconClass}`;
});
const svgClass = computed(() => {
  return props.className ? 'svg-icon ' + props.className : 'svg-icon';
});
</script>
<style scoped>
.svg-icon {
  fill: currentColor;
}
</style>
