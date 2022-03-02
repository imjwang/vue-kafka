<script setup>
import { ref, watch } from 'vue'

//time
const timer = ref(57)
const timer2 = ref(4)

const formatTimer = (t) => `--value:${t};`

const test = ref(formatTimer(57))
const test2 = ref(formatTimer(4)) 

watch(timer, (tick) => {
  test.value = formatTimer(tick)
  if (timer.value >= 60) {
    timer2.value++
    timer.value = 0
  }
})
watch(timer2, (tick) => {
  test2.value = formatTimer(tick)
})
</script>

<template>
<div class="navbar bg-neutral text-neutral-content">
  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="30" height="30" />
  <p class="ml-2 text-4xl">Vue-Kafka</p>
  <div class="navbar-end">
<span class="font-mono text-2xl countdown">
  <span :style="test2"></span>:
  <span :style="test"></span>
</span>
    <button class="btn text-xl btn-circle btn-sm btn-accent ml-2" @click="timer++">+</button>
  </div>
</div>    
</template>