<script setup>
import { watch, ref } from "vue";

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

})
const searchTerm = ref('');
const items = ref([]);
let timeoutId = null;
async function search() {
    try {
        items.value = await props.searchFunction(searchTerm.value);
    } catch (error) {
        console.error(error);
    }
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
        <input type="text" v-model="searchTerm" :placeholder="placeholder" style="width: 100%;height: 3rem;">
    </div>
</template>