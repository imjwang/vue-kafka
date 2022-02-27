<script setup>
import { ref, onMounted } from 'vue'
import { debouncedWatch, useResizeObserver } from '@vueuse/core'
import * as d3 from 'd3'

const test = ref(null)
const text = ref({})
// onmounted generate svg
// TODO generate a D3 viz
onMounted(() => {
    const svg = d3.select(test.value)
    svg.attr('width', 500)
    .attr('height', 100);

    svg.append('circle')
    .attr('cx', 25)
    .attr('cy', 50)
    .attr('r', 25)
    .attr('fill', 'blue')
})


//Resize with debounced watch
const resize = ref(null)
useResizeObserver(resize, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    text.value = {width: width, height: height}
})

const test2 = ref('')

debouncedWatch(text, () => {
    test2.value = `width: ${text.value.width} height: ${text.value.height}`
}, {debounce: 1000})
</script>

<template>
    <div ref="resize">
        {{test2}}
        <svg ref="test">
        </svg>    
    </div>
</template>