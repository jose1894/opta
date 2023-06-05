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

const emit = defineEmits(["nodeSelected"]);
const state = reactive({
  nodes: props.nodes
});

const toggleCollapse = (nodeId) => {
  const node = props.nodes.find((n) => n._id === nodeId);
  if (node) {
    node.collapsed = !node.collapsed;
  }
  emit('nodeSelected', node);
};


const handleNodeSelected = (nodeId) => {
  console.log(nodeId)
  //console.log(state.selectedNodeId)
  emit('nodeSelected', nodeId);
};
</script>

<template>
  <div>
    <ul>
      <li v-for="node in nodes" :key="node._id">
        <span :class="{ selected: node.collapsed }" @click="toggleCollapse(node._id)">
          <i v-if="node.children" :class="node.collapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-down'"></i>
          {{ node.nombre }} {{ node.collapsed }} 
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
  list-style-type: dot;
}
</style>
