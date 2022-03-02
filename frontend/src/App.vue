<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useWebSocket, useTimeout } from '@vueuse/core'
import { watch, ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import BarChart from '@/components/BarChart.vue'
import Nav from '@/components/Nav.vue'
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
<div class="w-screen">
  <Nav />
    <div class="flex flex-col w-full lg:flex-row">
      <bar-chart :data=val />
        <h1>{{val[val.length - 1]}}</h1>
        <div class="divider lg:divider-horizontal"></div> 
              <bar-chart :data=val />
        <h1>{{val[val.length - 1]}}</h1>
    </div>
</div>
</template>