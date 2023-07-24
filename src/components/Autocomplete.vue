<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: '',
    },
    searchFunction: {
        type: Function,
        required: true,
    },
    renderFunction: {
        type: Function,
        required: true,
    },
    debounceTime: {
        type: Number,
        default: 300,
    }
});

const searchTerm = ref('');
const showList = ref(true);
const items = ref([]);

const filteredItems = computed(() => {
    const data = items.value/*.filter(item =>
        item.nombres.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
    console.log(data)*/
    showList.value = true
    return data
});

let timeoutId = null;

async function search() {
    try {
        items.value = await props.searchFunction(searchTerm.value);
    } catch (error) {
        console.error(error);
    }
}

function onItemClick(item) {
    console.log(item.nombres)
    props.renderFunction(item);
    searchTerm.value = ""//item.nombreCompleto;
    showList.value = false
}

watch(searchTerm, function (newSearchTerm, oldSearchTerm) {
    clearTimeout(timeoutId);   
    if (newSearchTerm !== oldSearchTerm) {
        timeoutId = setTimeout(search, props.debounceTime);
    }
});
</script>

<template>
    <div>
      <input type="text" v-model="searchTerm" :placeholder="placeholder" style="width: 100%;">
      <ul v-if="filteredItems.length > 0 && showList">
        <li v-for="item in filteredItems" :key="item.id" @click="onItemClick(item)">
            {{ item.nombreCompleto }} {{ item?.apellidos }} 
        </li>
      </ul>
    </div>
  </template>
<style scoped>
ul {
  /*position: absolute;
  top: 100%;*/
  left: 0;
  z-index: 1000;
  display: block;
  width: 100%;
  margin-top: 0.1rem;
  padding: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

li {
  padding: 0.5rem;
  cursor: pointer;
}

li:hover {
  background-color: #bdb8dd;
}
</style>
