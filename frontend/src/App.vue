<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useWebSocket, useTimeout } from '@vueuse/core'
import { watch, ref, provide } from 'vue'
import { defineStore } from 'pinia'
import BarChart from '@/components/BarChart.vue'
import Nav from '@/components/Nav.vue'
import ChartCard from '@/components/ChartCard.vue'

// Set up connection to Kafka Client
const { status, data, close } = useWebSocket('ws://localhost:3002/', {
  autoReconnect: true,
  onConnected: ws => ws.send('frontend'),
})
const val = ref([])

// TODO move this to BarChart and inject provide
const test = ref([{
  name: 'test',
  data: val.value
}])

const test2 = ref({
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: val.value.length
        }
      })



watch(data, (newData) => {
  const parse = JSON.parse(newData)
  val.value.push(parseInt(parse.data))
})

//provide kafka data
provide('data', val)

</script>

<template>
<div class="w-screen h-screen">
  <Nav />
  <h1 class="text-4xl">Data Testing</h1>
  <p>{{val[val.length-1] || 'No Data Received Yet.'}}</p>
    <div class="flex flex-col w-full h-5/6 lg:flex-row">
    <ChartCard>
      <apexchart width="500" :options=test2 type="line" :series="test"></apexchart>
    </ChartCard>
        <div class="pt-8 divider lg:divider-horizontal"></div>
    <ChartCard />
    </div>
</div>
</template>