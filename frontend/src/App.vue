<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useWebSocket, useDraggable } from "@vueuse/core";
import { watch, unref, ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import Nav from "@/components/Nav.vue";
import ChartCard from "@/components/ChartCard.vue";

// Set up connection to Kafka Client, remove status and close?
const { status, data, close } = useWebSocket("ws://localhost:3002/", {
  autoReconnect: true,
  onConnected: (ws) => ws.send("frontend"),
});
// ref to keep history of data
const val = ref([]);

watch(data, (newData) => {
  const parse = JSON.parse(newData);
  val.value.push(parseInt(parse.data));
});

// Compute series data
const series = computed(() => {
  return [{ name: "test", data: val.value }];
});

const chartOptions = {
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    text: "My Graph",
    align: "left",
    style: {
      color: "",
    },
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: val.value.length,
  },
};

const testeroni = ref(null);

// TODO turn this into composable?
onMounted(() => {
  // get color from element
  const test = window.getComputedStyle(unref(testeroni)).backgroundColor;
  // format
  const format = (rgb) =>
    rgb
      .split(", ")
      .map((s) => s.replace(/[^\d.-]/g, ""))
      .map((s) => (+s).toString(16))
      .join("");
  console.log(`#${format(test)}`);
});
</script>

<template>
  <div class="w-screen h-screen">
    <div ref="testeroni" class="bg-orange-400"></div>
    <Nav />
    <h1 class="text-4xl">Data Testing</h1>
    <p>{{ val[val.length - 1] || "No Data Received Yet." }}</p>
    <ChartCard>
      <apexchart
        ref="retest"
        width="100%"
        height="100%"
        :options="chartOptions"
        type="line"
        :series="series"
      ></apexchart>
    </ChartCard>
  </div>
</template>
