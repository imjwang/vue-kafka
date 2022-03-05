<script setup>
import { ref, inject } from 'vue'

defineProps({
    items: Array
})

// TODO inject current tab from home page
// /const current = inject('tab')

</script>

<template>
<div class="tabs">
    <a class="text-accent-content tab tab-lg tab-lifted hover:bg-accent" v-for="i in items" :key="i.name">
        {{ i.name }}
    </a>
</div>
</template>