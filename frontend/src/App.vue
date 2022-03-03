<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useWebSocket, useTimeout } from '@vueuse/core'
import { watch, ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import BarChart from '@/components/BarChart.vue'
import Nav from '@/components/Nav.vue'
import ChartCard from '@/components/ChartCard.vue'
import * as d3 from 'd3'

// Set up connection to Kafka Client
const { status, data, close } = useWebSocket('ws://localhost:3002/', {
  autoReconnect: true,
  onConnected: ws => ws.send('frontend'),
})
const val = ref([])

watch(data, (newData) => {
  const parse = JSON.parse(newData)
  val.value.push(parseInt(parse.data))
})

</script>

<template>
<div class="w-screen h-screen">
  <Nav />
  <h1 class="text-4xl">Data Testing</h1>
  <p>{{val[val.length-1] || 'No data yet'}}</p>
    <div class="flex flex-col w-full h-5/6 lg:flex-row">
    <ChartCard />
        <div class="pt-8 divider lg:divider-horizontal"></div>
    <ChartCard />
    </div>
</div>
</template>