<script setup>
import { ref, inject } from "vue";

defineProps({
  items: Array,
});

const currentTab = ref("");
</script>

<template>
  <div class="tabs">
    <a
      v-for="i in items"
      :key="i.name"
      class="text-primary-content bg-primary tab tab-bordered hover:bg-accent"
      @click="currentTab = i.name"
      :class="{
        'tab-active': currentTab === i.name,
        'bg-accent': currentTab === i.name,
      }"
    >
      {{ i.name }}
    </a>
  </div>
</template>
