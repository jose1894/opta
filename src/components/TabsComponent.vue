<script setup>
    import { ref } from "vue";
    const props = defineProps({
        tabs: []
    });
    const emit = defineEmits(["tabClick"]);
    const activeTab = ref(0)
    const selectTab = (i) => {
        emit("tabClick", i);
        activeTab.value = i;
    }
</script>
<template>
    <ul class="mb-5 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row">
        <li v-for="(tab, i) in tabs" :key="tab.title" class="flex-grow basis-0 text-center"
            :class="{ active: activeTab === i }" @click="selectTab(i)">
            <a class="my-2 block border-x-0 border-t-0 border-b-2 border-transparent 
                        px-7 pt-4 pb-3.5 text-xs font-medium uppercase 
                        leading-tight text-neutral-500 hover:isolate 
                        hover:border-transparent hover:bg-neutral-100 
                        focus:isolate focus:border-transparent data-[te-nav-active]:border-primary 
                        data-[te-nav-active]:text-primary dark:text-neutral-400 
                        dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 
                        dark:data-[te-nav-active]:text-primary-400">
                {{ tab.title }}
            </a>
        </li>
    </ul>
    <slot></slot>
</template>
<style scoped>
li:hover {
    cursor: pointer;
}
.active a {
    color: blue;
    border-bottom: 1px solid;
    background: #e0e0e6;
    ;
}
</style>