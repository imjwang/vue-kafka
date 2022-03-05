<script setup>
//TODO use title prop and description
//TODO slot for placing widgets
import { ref } from 'vue'
import { useDraggable, useResizeObserver, debouncedWatch } from '@vueuse/core'


const drag = ref(null)

const { x, y, style } = useDraggable(drag, {
  onStart: (pos, e) => {
    return e.ctrlKey
  },
  initialValue: { x: 40, y: 40 },
})
</script>



 <template>
      <div ref="drag" :style="style" style="position: fixed" class="hover:shadow-md hover:shadow-info resize card border-2
       border-info w-100 h-100 text-info-content my-4 mx-4 py-2 px-2">
        <slot></slot>
      </div>  
 </template>
