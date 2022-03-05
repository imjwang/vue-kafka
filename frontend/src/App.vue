<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useWebSocket, useTimeout, useDraggable } from '@vueuse/core'
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

const chartOptions = {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'My Graph',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: val.value.length,
            }
          }

watch(data, (newData) => {
  const parse = JSON.parse(newData)
  val.value.push(parseInt(parse.data))
})

//provide kafka data
provide('data', val)

const retest = ref(null)

</script>

<template>
<div class="w-screen h-screen">
  <Nav />
  <h1 class="text-4xl">Data Testing</h1>
  <p>{{val[val.length-1] || 'No Data Received Yet.'}}</p>
    <ChartCard>
      <apexchart ref="retest" width="100%" height="100%" :options=chartOptions type="line" :series="test"></apexchart>
    </ChartCard>
</div>
</template>