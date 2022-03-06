<script setup>
import { ref, inject } from "vue";
import { debouncedWatch, useResizeObserver } from "@vueuse/core";

//inject Kafka data
const data = inject("data", [0]);
const text = ref({ width: 800, height: 800 });

// TODO allow resize with debounced watch
const resize = ref(null);
useResizeObserver(resize, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  text.value = { width: ~~width, height: ~~height };
});

const test2 = ref("");

debouncedWatch(
  text,
  () => {
    test2.value = `width: ${text.value.width} height: ${text.value.height}`;
  },
  { debounce: 1000 }
);
</script>

<template>
  <div ref="resize">
    {{ test2 }}
    <apexchart type="line" :series="data"></apexchart>
  </div>
</template>
