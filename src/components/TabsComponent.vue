<script setup>
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";
    import BaseButton from "./BaseButton.vue";
    import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiClose } from "@mdi/js";

    const { t } = useI18n();
    const props = defineProps({
        tabs: []
    });
    const emit = defineEmits(["tabClick"]);
    const activeTab = ref(0)
    const selectTab = (i) => {
        emit("tabClick", i);
        activeTab.value = i;
    }
    const nextTab = () => {
        console.log(activeTab.value)
        const nextTab = activeTab.value + 1;
        emit("tabClick", nextTab);
        activeTab.value = nextTab;
    }
    const backTab  = () => {
        console.log(activeTab.value)
        const nextTab = activeTab.value - 1;
        emit("tabClick", nextTab);
        activeTab.value = nextTab;
    }
</script>
<template>
    <ul class="mb-5 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row">
        <li v-for="(tab, i) in tabs" :key="tab.title" class="flex-grow basis-0 text-center"
            :class="{ active: activeTab === i }" @click="selectTab(i)">
            <a class="my-2 block text-blue-600 border-x-0 border-t-0 border-b-2 border-transparent 
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
    <div class="mt-2" style="display: inline-block;float:right">
    <BaseButton
        :icon="mdiChevronDoubleLeft"
        small
        rounded-full
        :class="`mx-2`"
        color="info"
        v-show="activeTab !== 0"
        @click="backTab"
      />
    <BaseButton
        :icon="mdiChevronDoubleRight"
        small
        rounded-full
        :class="`mx-2`"
        color="info"
        v-show="activeTab !== tabs.length - 1" 
        @click="nextTab"
      />
    
    </div>
    
</template>
<style scoped>
li:hover {
    cursor: pointer;
}
.active a {
    /* color: blue; */
    border-bottom: 1px solid;
    background: #e0e0e6;
    ;
}
.btn-next {
    background: #2563eb;
    padding: 5px 10px;
    color: white;
    border-radius: 5px;
    min-width: 86px;
    margin-left: 2px;
}
</style>