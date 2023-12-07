<script setup>
import {
  defineProps,
  reactive,
  ref
} from 'vue';
const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
  selectedNodeId: Number,
  treeView: {
    type: Boolean,
    required: true,
    default: true,
  },
})
const activeIndex = ref(0);

const emit = defineEmits(["nodeSelected","itemSelected"]);
const state = reactive({
  nodes: props.nodes
});

const toggleCollapse = (nodeId, option) => {
  activeIndex.value = 0
  const node = props.nodes.find((n) => n._id === nodeId);
  const nodesList = props.nodes
  props.nodes = nodesList.map((nod) => {
    nod.active = nod._id === nodeId ? 'active' : 'selected'
    return nod
  })
  console.log(node)
  if (node) {
    node.collapsed = !node.collapsed;
    node.active = !node.active;
  } 
  emit('nodeSelected', node);
  activeIndex.value = nodeId
};


const handleNodeSelected = (nodeId) => {
  activeIndex.value = 0
  emit('nodeSelected', nodeId);
  activeIndex.value = nodeId._id
};

const onSearchChildren = (node) => {
  emit('itemSelected', node);
};

const addIconPlus = (node) => {
  const nodeChildren = node.children
  return nodeChildren.some((item) => item.visible === 1)
};



</script>

<template>
  <div v-if="treeView">
    <ul>
      <li v-for="node in nodes" :key="node._id" class="pli">
        <span :class="activeIndex === node._id ? 'selected' : ''" 
          @click="toggleCollapse(node._id, 1)">
          <i v-if="node.children.length" :class="node.collapsed ? 'fa fa-minus' : 'fa fa-plus'"></i>
          <span :class="node.children.length > 0 ? 'ml2' : 'ml1'"> 
            {{ node.indice }} - {{ node.nombre }}
          </span>          
        </span>
        <TreeItem :nodes="node.children" v-if="node.children.length > 0 && (node.collapsed)"
          @nodeSelected="handleNodeSelected"/>
      </li>
    </ul>
  </div>
  <div v-if="!treeView">
    <ul style="margin-bottom: 10px;">
      <template v-for="node in nodes" :key="node._id">
        <li v-if="node.visible === 1" style="margin-bottom: 10px;">
          <span :class="activeIndex === node._id ? 'selected' : ''"  @click="onSearchChildren(node)">
            <i v-if="node.children.length > 0 " class="fa fa-folder folder-treeView"></i>
            <i v-if="node.children.length === 0 " class="fa-solid fa-folder-minus"></i>
            {{ node.indice }} - {{ node.nombre }}
            <i v-if="node.children.length > 0 && addIconPlus(node)" class="fa fa-solid fa-plus plus-icon"  @mouseover="toggleCollapse(node._id, 1)"></i>
          </span>
          <TreeItem :nodes="node.children" v-if="node.children && (node.collapsed)" :treeView="false" @itemSelected="onSearchChildren" />
        </li>
      </template>

    </ul>
  </div>
</template>
<style scoped>
.dropdown{
  display: none;
}
.dropdown:hover{
    display: block;
}
.pli:hover{
    cursor: pointer;
}
.item {
  cursor: pointer;
}

.bold,
.selected {
  font-weight: bold;
}

ul {
  padding-left: 1em;
  line-height: 1.5em;
  /*list-style-type: dot;*/
}

.fa-folder-open {
  color: rgb(246, 246, 0);
  padding: 5px;
}

.folder-treeView {
  color: rgb(246, 246, 0)!important;
}

.fa-folder, .fa-folder-minus {
  color: rgb(198, 198, 101);
  border: 1px solid rgb(250, 253, 250);
  padding: 5px;
}

.active {
  color: rgb(255, 0, 0);
}

.plus-icon {
  color: rgb(2 46 119);
  padding: 5px;
} 

.ml1 {
  margin-left: 26px;
}

.ml2 {
  margin-left: 10px;
}

.pli {
    padding: 5px 0px;
}
</style>
