<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { debouncedWatch, useResizeObserver } from '@vueuse/core'
import {
    select,
    line,
    scaleLinear,
    max,
    min,
    axisBottom,
    axisLeft,
    curveBasis
} from 'd3'

const props = defineProps(['data'])

const yaxis = ref(null)
const xaxis = ref(null)

const test = ref(null)
const text = ref({width: 500, height: 500})
// onmounted generate svg
// TODO generate a D3 viz
onMounted(() => {
    const svg = select(test.value)
    
    watchEffect(() => {
        const {width, height} = text.value


         const xScale = scaleLinear()
          .domain([0, props.data.length - 1]) // input values...
          .range([0, width]); // ... output values

        const yScale = scaleLinear()
          .domain([0, 1000]) // input values...
          .range([height, 0]); // ... output values

        // line generator: D3 method to transform an array of values to data points ("d") for a path element
        const lineGen = line()
          .curve(curveBasis)
          .x((value, index) => xScale(index))
          .y((value) => yScale(value));

        // render path element with D3's General Update Pattern
        svg
          .selectAll(".line") // get all "existing" lines in svg
          .data([props.data]) // sync them with our data
          .join("path") // create a new "path" for new pieces of data (if needed)

          // everything after .join() is applied to every "new" and "existing" element
          .attr("class", "line") // attach class (important for updating)
          .attr("stroke", "green") // styling
          .attr("d", lineGen); // shape and form of our line!

        // render axes with help of scales
        // (we let Vue render our axis-containers and let D3 populate the elements inside it)
        svg
          .select(xaxis.value)
          .style("transform", `translateY(${height}px)`) // position on the bottom
          .call(axisBottom(xScale));

        svg.select(yaxis.value).call(axisLeft(yScale));


    })
})


//Resize with debounced watch
const resize = ref(null)
useResizeObserver(resize, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    text.value = {width: ~~width, height: ~~height}
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
            <g class="xaxis" />
            <g class="yaxis" />
        </svg>    
    </div>
</template>