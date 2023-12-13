<script setup>
import { computed, defineProps, onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { useI18n } from "vue-i18n";
import CardBox from '@/components/CardBox.vue';
import RisksTableView from './RisksTableView.vue'
import TreeItem from '@/components/TreeItem.vue';
import Breadcrumb from '@/components/Breadcrumb.vue'
import SectionMain from '@/components/SectionMain.vue';
import enfoquesServices from '@/services/enfoques.service';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import AudiTableView from './AudiTableView.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import CardBoxModal from "@/components/CardBoxModal.vue";
import riesgosServices from '@/services/riesgos.service';

const { t } = useI18n();
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
const isModalListRik = ref(false);
const hasModalValue = false;
const pageRisk = ref(1);
const perPageRisk = ref(10);
const overlayModal = ref(false);
const btnCloseModal = ref(true);

const params = ref({
    cuadrante: 0
});

const state = reactive({
    selectedNodeId: null,
});

const breadcrumbs = ref([
    { name: 'Inicio', link: '/setup/papers/' }
])
const { codigo } = JSON.parse(localStorage.getItem('selectedProject'))

let data = [{projectId: codigo }]

const activeIndex = ref(0);
const openSubmenuIndex = ref(-1);

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
    emit('changePage', page)
}

const onChangePage = (page) => {
    endPointUse({ page })
}

const onRefresh = () => {
    const node = JSON.parse(localStorage.getItem('selectedNode'))
    onSearchChildren(node)
}


const onSearchChildren = (node) => {
    dataList.value = node
    titleAuditEnfoque.value = node?.ruta
    localStorage.setItem('selectedNode', JSON.stringify(node))
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
})

const chilItem = (data, enfoques = []) => {
    return data.map((item) => {
        const child = enfoques.filter((itemEnfo) => itemEnfo?.areaPadre?._id === item._id)
        if (child.length > 0) {
            item.children = child
            chilItem(child, enfoques)
        }
        return item
    })

}

const openModal = () => {
    isModalListRik.value = true
}

const titleModal = () => {
    return  t('message.audit.riskControlRegistration')
}

const onChangePageRisk = (pageRisk) => {
    const dataParam = {
        q: data,
        pageRisk
    }
    console.log(dataParam)
    endPointRiskUse(dataParam)
}

const onSortPageRisk = (sortBy, sortDesc) => {
    endPointRiskUseSort({ sortBy, sortDesc });
}

const endPointRiskUse = (dataParam) => {
    getRisk(dataParam)
    
}

const endPointRiskUseSort = (sortBy, sortDesc) => {
    getRisk({ sortBy, sortDesc, q: data })
}

const getRisk = (data) => {
    riesgosServices.index(data).then(response => {
        mainStore.listRisk = response
        pageRisk.value = response.page
        perPageRisk.value = response.perPage
    })
}

getRisk({pageRisk: pageRisk.value, q: data})

const enviarParametros = (idCuadrante) => { 
    if (idCuadrante !== 0) {
        const data2 = [
            {cuadrante:idCuadrante}
        ] 
        getRisk({pageRisk:pageRisk.value, q: data, q2: data2 })   
    } else {
        getRisk({pageRisk:pageRisk.value, q: data })
    }
    
} 

const enviarParametrosEC = (value) => {    
    const data3 = [
        {expectativasNegocio:value}
    ] 
        getRisk({pageRisk:pageRisk.value, q: data, q3: data3 }) 
        
}

</script>
<template>
    <CardBoxModal 
        v-model="isModalListRik" 
        :title="titleModal()" 
        :hasDone="hasModalValue"
        :hasClose="btnCloseModal"
        :overlayClick="overlayModal"
        claseModal="shadow-lg max-h-modal w-11/12 md:w-11/12 lg:w-11/12 xl:w-11/12 z-50">
        <CardBox >
            <div class="c-header">
                <div class="c-body">
                    <div class="c-padding-items">
                        <span>{{ $t('message.audit.RiskMatrix') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametros(0)">
                        <span>{{ $t('message.audit.allRisks') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametros(1)">
                        <span>{{ $t('message.audit.quadrantI') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametros(2)">
                        <span>{{ $t('message.audit.quadrantII') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametros(3)">
                        <span>{{ $t('message.audit.quadrantIII') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametros(4)">
                        <span>{{ $t('message.audit.quadrantIV') }}</span>
                    </div>
                    <div class="c-padding-items" @click="enviarParametrosEC('Expectativas del cliente')">
                        <span>{{ $t('message.audit.customerExpectations') }}</span>
                    </div>
                </div>
            </div>
        </CardBox>
        <CardBox style="padding-left: 0px; padding-right: 0px;">
            <div class="container-table col-span-4">                   
                <CardBox v-if="mainStore?.listRisk?.riesgos?.length"  has-table>
                    <RisksTableView @changePage="onChangePageRisk" @sort="onSortPageRisk" />
                 </CardBox>
                <CardBox v-else>
                    <CardBoxComponentEmpty />
                </CardBox>
            </div>
        </CardBox>         
    </CardBoxModal>
    <LayoutAuthenticated>
        <SectionMain>
            <Breadcrumb :items="breadcrumbs" />

            <div class="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <div class=" container-treeview bg-gray-200 col-span-2">
                    <TreeItem :nodes="menuData" :treeView="false" :selectedNodeId="state.selectedNodeId"
                        @itemSelected="onSearchChildren" />                    
                    <hr class="c-hr">
                    <div>
                        <ul class="c-ul">
                            <li class="c-li" style="margin-top: 10px;" @click="openModal()" >
                                <span>{{ $t('message.audit.riskControlRegistration') }}</span>
                            </li>
                            <li class="c-li">
                                <span>{{ $t('message.audit.pointsOf') }}</span>
                            </li>
                            <li class="c-li">
                                <span>{{ $t('message.audit.sampling') }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="container-table col-span-4">
                   
                    <CardBox v-if="mainStore?.auditAproaches?.enfoques?.length" class="mb-6" has-table>
                        <div class="header-title">
                            <span class="span-header-title">{{ titleAuditEnfoque }}</span>
                        </div>
                        <AudiTableView path="create" @changePage="onChangePage" @sort="onSortPage" @refreshList="onRefresh"/>
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
    background: #fff;
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

.c-hr {
    border-bottom: solid 1px #80808069;
    width: 100%;
}
.c-ul {
    padding-left: 1em;
    line-height: 1.5em;
}
.c-li{
    margin-bottom: 10px;
}

.c-li:hover{
    background: #80808054;
    cursor: pointer;
}

.c-header{
   height: 45px;
}

.c-body{
    display: flex; 
    flex-direction: row; 
    flex-wrap: wrap;
    height: 100%;
}

.c-padding-items{
   padding: 0px 15px;
   height: 100%;
   color: blue;
   display: grid;
   place-content: center;
}

.c-padding-items:hover{
   color: white;
   background: rgb(41, 41, 202);
}



</style>

