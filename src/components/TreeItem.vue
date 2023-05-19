<script setup>
import {
    computed,
    defineProps,
    ref
} from 'vue';

const props = defineProps({
  model: Object
})

const emit = defineEmits(["update:modelValue", "optionTreeSelected", "onOpen"]);
const isOpen = ref(false)
const isFolder = computed(() => {
  return props.model?.children && props.model?.children.length
})

const dataSelected = (model, index, child) => {
    console.log(index)
    console.log(model)
    console.log(child)
    emit("optionTreeSelected", child, isOpen.value);    
};

const toggle = () => {    
  console.log("toggle*************")
  console.log(props.model)
  isOpen.value = !isOpen.value 
  emit("optionTreeSelected", props.model, isOpen.value); 
  
}

const changeType = () => {
  if (!isFolder.value) {
    props.model.children = []
    addChild()
    isOpen.value = true
  } 
}

const openChild = (open, model) => {
  console.log("openChild*************")
  console.log(model)
  //emit("onOpen", open, model);
}
const addChild = () => {
  console.log("AddnChild*************")
  console.log(props.model)
  //props.model.children.push({ nombre: 'Root' })
}
</script>

<template>
  <li>
    <div
      :class="{ bold: isFolder }"
      @click="toggle"
      @dblclick="changeType">
      <span >{{ model?.nombre }}</span>
      <span @click="addChild">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="(child, index) in model.children"
        :key="index"
        :model="child" 
        @click="dataSelected(model.children, index, child)">
        jkjkj
      </TreeItem>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>
<style scoped>
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
