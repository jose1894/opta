<script setup>
import {
    computed,
    defineProps,
    ref
} from 'vue';

const props = defineProps({
  model: Object
})

const emit = defineEmits(["update:modelValue", "optionTreeSelected"]);
const isOpen = ref(false)
const isFolder = computed(() => {
  return props.model.children && props.model.children.length
})

const dataSelected = (item) => {
    console.log(item)
    emit("optionTreeSelected", item);    
};

const toggle = () => {    
  isOpen.value = !isOpen.value  
}

const changeType = () => {
  if (!isFolder.value) {
    props.model.children = []
    addChild()
    isOpen.value = true
  }
}

const addChild = () => {
  props.model.children.push({ name: 'Root' })
}
</script>

<template>
  <li>
    <div
      :class="{ bold: isFolder }"
      @click="toggle"
      @dblclick="changeType">
      <span  @click="dataSelected(model)">{{ model.name }}</span>
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem
        class="item"
        v-for="model in model.children"
        :model="model">
      </TreeItem>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>