<script setup>
import { computed, defineProps, onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '@/stores/main';
import CardBox from '@/components/CardBox.vue';
import RecursiveMenuItem from '@/components/RecursiveMenuItem.vue'
import TreeItem from '@/components/TreeItem.vue';
import Breadcrumb from '@/components/Breadcrumb.vue'
import SectionMain from '@/components/SectionMain.vue';
import enfoquesServices from '@/services/enfoques.service';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import AudiTableView from './AudiTableView.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';


const page = ref(1);
const menuItems = [];
const dataList = ref();
const perPage = ref(10);
const menuData = ref([]);
const titleAuditEnfoque = ref();
const projectId = ref();
const projectCode = ref();
const route = useRoute();
const mainStore = useMainStore();

const state = reactive({
    selectedNodeId: null,
});

const breadcrumbs = ref([
    { name: 'Inicio', link: '/setup/papers/' }
])

const activeIndex = ref(0);
const openSubmenuIndex = ref(-1);

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
    emit('changePage', page)
}

const onChangePage = (page) => {
    endPointUse({ page })
}

const onSearchChildren = (node) => {
    dataList.value = node
    titleAuditEnfoque.value = node?.ruta
    getAproaches(node)
}

const onSortPage = (sortBy, sortDesc) => {
    endPointUseSort({ sortBy, sortDesc });
}

const endPointUse = (page) => {
    getAproaches({ page })
}

const endPointUseSort = (sortBy, sortDesc) => {
    getAproaches({ sortBy, sortDesc })
}

const getAproaches = (data) => {
    const { _id } = dataList.value ?? {}
    const dataParam = { page: page.value }
    const idEnfooque = _id === undefined ? 1 : _id
    console.log(dataList.value)
    enfoquesServices.getChildrenWithPaginate(idEnfooque, dataParam).then(response => {

        mainStore.auditAproaches = response
        page.value = response.page
        perPage.value = response.perPage
    })
}

getAproaches({ page: page.value })

onMounted(async () => {
    const { _id, codigo, nombre } = route.params
    projectId.value = _id
    projectCode.value = codigo


    breadcrumbs.value.push({ name: `${codigo} - ${nombre}` })

    let listEnfoques = await enfoquesServices.index()
    const { enfoques } = listEnfoques

    const nodeFirst = enfoques.filter((item) => item.tipoNodo === 0);
    const dataEnfoques = enfoques.filter((item) => item.tipoNodo !== 0);
    const menu11 = chilItem(nodeFirst, dataEnfoques)
    menuData.value = menu11[0].children

    console.log(menu11);
})

const chilItem = (data, enfoques = []) => {
    return data.map((item) => {
        const child = enfoques.filter((itemEnfo) => itemEnfo?.areaPadre === item._id)
        if (child.length > 0) {
            item.children = child
            chilItem(child, enfoques)
        }
        return item
    })

}

</script>
<template>
    <LayoutAuthenticated>
        <SectionMain>
            <Breadcrumb :items="breadcrumbs" />

            <div class="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <div class=" container-treeview bg-gray-200 col-span-2">
                    <TreeItem :nodes="menuData" :treeView="false" :selectedNodeId="state.selectedNodeId"
                        @itemSelected="onSearchChildren" />

                    <!-- <RecursiveMenuItem :menuItems="menuData" /> -->

                </div>
                <div class="container-table col-span-4">
                   
                    <CardBox v-if="mainStore?.auditAproaches?.enfoques?.length" class="mb-6" has-table>
                        <div class="header-title">
                            <span class="span-header-title">{{ titleAuditEnfoque }}</span>
                        </div>
                        <AudiTableView path="create" @changePage="onChangePage" @sort="onSortPage" />
                    </CardBox>
                    <CardBox v-else>
                        <CardBoxComponentEmpty />
                    </CardBox>
                </div>
            </div>

        </SectionMain>
    </LayoutAuthenticated>
</template>
<style scoped>
.container-treeview {
    padding: 20px;
    border-radius: 24px;
}

.container-table {
    background: #d8dde5;
    border-radius: 24px;
    padding: 20px;
}
.header-title{
    display: flex; 
    flex-direction: row;
    justify-content: flex-start; 
    align-items: center;
    padding: 10px;
    background: #2563eb;
    color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}
.span-header-title{
    font-weight: 700;
}
</style>

