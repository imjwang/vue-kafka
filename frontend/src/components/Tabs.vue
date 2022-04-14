<script setup>
import { ref } from "vue";
import { useTabStore } from "@/stores/tabs";

defineProps({
  tabs: Object,
});

const store = useTabStore();
</script>

<template>
  <div class="tabs">
    <a
      v-for="(_, tab) in tabs"
      :key="tab"
      class="text-primary-content bg-primary tab tab-bordered hover:bg-accent"
      @click="store.currentTab = tab"
      :class="{
        'tab-active': store.currentTab === tab,
        'bg-accent': store.currentTab === tab,
      }"
    >
      {{ tab }}
    </a>
  </div>
  <component :is="tabs[store.currentTab]"></component>
</template>
