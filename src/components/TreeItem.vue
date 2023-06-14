<script setup>
import {
    computed,
    defineProps,
    onMounted,
    reactive,
    ref
} from 'vue';

const props = defineProps({
  nodes:{
    type: Array,
    required: true,
  },
  selectedNodeId: Number,
})
const activeIndex = ref(0);

const emit = defineEmits(["nodeSelected"]);
const state = reactive({
  nodes: props.nodes
});

const toggleCollapse = (nodeId) => {
  activeIndex.value = 0 
  const node = props.nodes.find((n) => n._id === nodeId);
  const nodesList = props.nodes
  props.nodes = nodesList.map((nod)=>{
    nod.active = nod._id === nodeId ? 'active' : 'selected'
    return nod
  })
  if (node) {
    node.collapsed = !node.collapsed;
  }  
  emit('nodeSelected', node);
  activeIndex.value = nodeId
};


const handleNodeSelected = (nodeId) => {
  activeIndex.value = 0 
  emit('nodeSelected', nodeId);
  activeIndex.value = nodeId._id
};
</script>

<template>
  <div>
    <ul>
      <li v-for="node in nodes" :key="node._id">
        <span :class="activeIndex === node._id ? 'selected' : ''" @click="toggleCollapse(node._id)">
          <i v-if="node.children" :class="node.collapsed ? 'fa fa-folder-open' : 'fa fa-folder' "></i>
          {{ node.nombre }}
        </span>
        <TreeItem 
          :nodes="node.children" 
          v-if="node.children && node.collapsed" 
          @nodeSelected="handleNodeSelected" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.item {
  cursor: pointer;
}
.bold, .selected {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  /*list-style-type: dot;*/
}
.fa-folder-open {
  color:rgb(246, 246, 0); 
  padding: 5px; 
}

.fa-folder {
  color: rgb(198, 198, 101);;
  border: 1px solid rgb(250, 253, 250); 
  padding: 5px; 
}
.active {
  color: rgb(255, 0, 0);
}
</style>
