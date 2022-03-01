<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useWebSocket, useTimeout } from '@vueuse/core'
import { watch, ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import BarChart from '@/components/BarChart.vue'
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

//time
const timer = ref(0)
const formatTimer = (t) => `--value:${t};`
const test = ref(formatTimer(3))

watch(timer, (tick) => {
  test.value = formatTimer(tick)
})

</script>

<template>
<div class="navbar bg-neutral text-neutral-content">
  <p class="text-4xl">Hi</p>
  <div class="navbar-end">
<span class="font-mono text-2xl countdown">
  <span style="--value:10;"></span>:
  <span :style="test"></span>
</span>
    <button class="btn text-xl btn-circle btn-sm btn-accent ml-2" @click="timer++">+</button>
  </div>
</div>

  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <bar-chart :data=val />
        <h1>{{val[val.length - 1]}}</h1>
    </div>
  </header>

</template>