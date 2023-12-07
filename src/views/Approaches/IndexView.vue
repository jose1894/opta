<script setup>
import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref
} from 'vue';
import { useI18n } from "vue-i18n";
import moment from 'moment';
import { useToast } from 'vue-toastification';
import CardBox from '@/components/CardBox.vue';
import TreeItem from '@/components/TreeItem.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from "@/components/SectionMain.vue";
import enfoquesServices from '@/services/enfoques.service';
import CardBoxModal from "@/components/CardBoxModal.vue";
import { mdiCodeBraces, mdiPlus, mdiListStatus } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


const { t } = useI18n();
const toast = useToast();
const isSelectedItemEnfoque = ref(false);
const isModalActive = ref(false);
const hasModalValue = false;
const selectedItemEnfoque = ref({});
const isModalDangerActive = ref(false);
let path = '';
const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})

const option = [
    { id: 0, label: t('message.no') },
    { id: 1, label: t('message.yes') },
];

const optionVisible = [
    { id: 0, label: t('message.list') },
    { id: 1, label: t('message.menu') },
];

const selectOptions = [
    { id: 1, label: t('message.approach.statuses.active') },
    { id: 0, label: t('message.approach.statuses.inactive') },
];
const dataInitial = {
    _id: '',
    indice: 0,
    nombre: "",
    areaPadreNombre: "",
    rutaPadre: "",
    areaPadre: "",
    ruta: "",
    visible: optionVisible[0],
    rcr: option[0],
    editable: option[0],
    estado: selectOptions[0],
    tipoNodo: 2
}
const enfoque = ref(dataInitial);

const state = reactive({
    selectedNodeId: null,
});


const treeData = ref()

const chilItem = (data, enfoques=[]) => {
    const menu1 = data.map((item) => { 
    const child =  enfoques.filter((itemEnfo) => itemEnfo?.areaPadre?._id === item._id)
        if(child.length > 0) {
            item.children = child 
            chilItem(child, enfoques)
        }
        return item
    })

}

onMounted(async () => {
    getEnfoques()
    if (props.path === 'update') {
        console.log(props.path)
    }    
});

const getEnfoques = (async () => {
    let listEnfoques = await enfoquesServices.index()
    const { enfoques } = listEnfoques
    const nodeFirst = enfoques.filter((item) => item.tipoNodo === 0);
    const dataEnfoques = enfoques.filter((item) => item.tipoNodo !== 0);
    const menu11= chilItem(nodeFirst, dataEnfoques)
    nodeFirst[0].collapsed = true
    treeData.value = nodeFirst
});
const successMessage = props.path === 'create' ? t("message.approach.created.success") : t("message.approach.updated.success")
const errorMessage = props.path === 'create' ? t("message.approach.created.error") : t("message.approach.updated.error")

const submit = async () => {
    action(enfoque)
        .then(() => {
            const m = localItemEnfoque()
            enfoqueChildren(m)
            setTimeout(() => {
                isModalActive.value = false
                toast.success(successMessage);                
            }, 500);           
        })
        .catch(err => {
            console.log(err) 
            if (err.response?.data?.msg) {
                toast.error(`${t("message.approach.created.error")} ${err.response.data.msg}`)
                return
            }

            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let errorStr = '';
                for (let attr of errors) {
                }
            }
        })

}

const action = async (enfoque) => {
    enfoque.value.tipoNodo = (enfoque.value.rutaPadre === '/') ? 1 : 2
    const { _id,
        indice,
        nombre,
        areaPadre,
        areaPadreNombre,
        rutaPadre,
        ruta,
        visible,
        rcr,
        editable,
        estado,
        tipoNodo } = enfoque.value;

    const data = {
        _id,
        indice,
        nombre,
        areaPadre,
        areaPadreNombre,
        rutaPadre,
        ruta,
        visible: visible.id,
        rcr: rcr.id,
        editable: editable.id,
        estado: estado.id,
        tipoNodo
    }
    if (path === 'create') {
        const fechaNew =moment(data.fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
        data.fecha = fechaNew
        return enfoquesServices.create(data)
    }
    return enfoquesServices.update(data);
}

const successMessageSelectNode = t("message.approach.selectedNode")
const btnAgregarEnfoque = () => {
    //enfoque.value = dataInitial
    path = "create";
    //isSelectedItemEnfoque.value = false
    if (Object.keys(selectedItemEnfoque.value).length === 0) {
        isSelectedItemEnfoque.value = true
        const dataNew = Object.assign({}, treeData.value[0]);
        const selectedData = Object.assign({}, dataNew);
        enfoque.value = dataNew
        enfoque.value.areaPadreNombre = dataNew.nombre
        enfoque.value.nombre = "",
        enfoque.value.rutaPadre = "/",
        enfoque.value.areaPadre = dataNew._id        
        enfoque.value.estado = selectOptions.filter(status => status.id === dataNew.estado)[0]
        enfoque.value.visible = optionVisible.filter(item => item.id === dataNew.visible)[0]
        enfoque.value.rcr = option.filter(item => item.id === dataNew.rcr)[0]
        enfoque.value.editable = option.filter(item => item.id === dataNew.editable)[0]
        enfoque.value.tipoNodo = 1     
        selectedItemEnfoque.value = selectedData
        localStorage.setItem('itemEnfoque', JSON.stringify(selectedItemEnfoque.value));
    } else {
        addValueEnfoque()
    }
    isModalActive.value = true
}

const btnEditarEnfoque = async () => {
    path = "update";
    enfoque.value = selectedItemEnfoque.value
    const { visible, estado, rcr, editable, areaPadre, areaPadreNombre, rutaPadre }  = selectedItemEnfoque.value
    console.log(selectedItemEnfoque.value)
    if(areaPadre) {
        enfoque.value.areaPadre = (typeof areaPadre === "object") ? areaPadre._id : areaPadre
        enfoque.value.areaPadreNombre = (typeof areaPadre === "object") ? areaPadre.nombre : areaPadreNombre 
        const APN = (typeof areaPadre === "object") ? areaPadre.ruta : rutaPadre 
        enfoque.value.rutaPadre = APN !== undefined ? APN : rutaPadre    
    }    
    enfoque.value.estado = selectOptions.filter(status => status.id === _isObject(estado))[0]
    enfoque.value.visible = optionVisible.filter(item => item.id === _isObject(visible))[0]
    enfoque.value.rcr = option.filter(item => item.id === _isObject(rcr))[0]
    enfoque.value.editable = option.filter(item => item.id === _isObject(editable))[0]
    isModalActive.value = true
}

const _isObject=(data) => { 
    return (typeof data === "object") ? data.id : data
};

const enfoqueChildren = async (m) => {
    if(!isSelectedItemEnfoque.value){
        m.children = []
        const child = await enfoquesServices.getChildren(m._id)
        const itemsEnfoque = child?.data?.children || [];
        m.children = itemsEnfoque
    } else {
        getEnfoques()       
    }
}

const asignarNodoPadre = (selectedEnfoque) => {
    selectedItemEnfoque.value = selectedEnfoque
    localStorage.setItem('itemEnfoque', JSON.stringify(selectedItemEnfoque.value));
    addValueEnfoque()    
}

const addValueEnfoque = () => {
    const selectedData = localItemEnfoque();
    enfoque.value = selectedData
    enfoque.value.areaPadre = selectedData._id
    enfoque.value.areaPadreNombre = selectedData.nombre
    enfoque.value.rutaPadre = selectedData.ruta
    if(props.path !== 'update') {
        enfoque.value._id = "",
        enfoque.value.indice = 0,
        enfoque.value.nombre = "",     
        enfoque.value.estado = selectOptions.filter(status => status.id === selectedData.estado)[0]
        enfoque.value.visible = optionVisible.filter(item => item.id === selectedData.visible)[0]
        enfoque.value.rcr = option.filter(item => item.id === selectedData.rcr)[0]
        enfoque.value.editable = option.filter(item => item.id === selectedData.editable)[0]
        enfoque.value.tipoNodo = selectedData.tipoNodo
    }
}

const localItemEnfoque = () => {
    const dataObject = localStorage.getItem('itemEnfoque');
    return JSON.parse(dataObject);
}

const handleNodeSelected = (parentId) => {
    enfoqueChildren(parentId)
    asignarNodoPadre(parentId)
};

const dataName = () => {
  const { nombre } = selectedItemEnfoque.value
  return nombre
}
const successMessageError = t("message.approach.deleted.success")
const deleteItem = async () => {
    deleteEnfoqueById()
    .then(async () => {
        getEnfoques() 
        toast.success(successMessageError);
        selectedItemEnfoque.value = {}
        localStorage.setItem('itemEnfoque', JSON.stringify(selectedItemEnfoque.value));
    })
    .catch(err => {
      toast.error(`${t("message.approach.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const deleteEnfoqueById = () => {
    const { _id } = selectedItemEnfoque.value
    return enfoquesServices.delete(_id);
};

const btnCerrarModalEnfoque  = () => isModalActive.value = false;


</script>

<template>
    <CardBoxModal 
        v-model="isModalDangerActive" 
        :title="$t('message.pleaseConfirm')"
        button="danger" 
        @confirm="deleteItem" 
        has-cancel>
        <strong>{{ $t('message.approach.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
    </CardBoxModal>
    <CardBoxModal v-model="isModalActive" title="Crear enfoque" 
        :hasDone="hasModalValue" 
        claseModal="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-8/12 xl:w-8/12 z-50">
        <CardBox isForm @submit.prevent="submit" style="height: 500px;
                overflow-y: scroll;scroll-behavior: smooth;">
            <div class="grid md:grid-cols-2 gap-2">
                <FormField :label="$t('message.approach.indice')">
                    <FormControl :name="'indice'" v-model="enfoque.indice" :icon="mdiCodeBraces" />
                </FormField>
                <FormField :label="$t('message.approach.name')">
                    <FormControl :name="'name'" v-model="enfoque.nombre" :icon="mdiCodeBraces" />
                </FormField>
                <FormField :label="$t('message.approach.parentArea')">
                    <FormControl :name="'parentArea'" v-model="enfoque.areaPadreNombre" :icon="mdiCodeBraces" :readonly="true"/>
                </FormField>
                <FormField :label="$t('message.approach.visible')">
                    <FormControl v-model="enfoque.visible" :icon="mdiListStatus" :options="optionVisible" />
                </FormField>
                <FormField :label="$t('message.approach.rcr')">
                    <FormControl v-model="enfoque.rcr" :icon="mdiListStatus" :options="option" />
                </FormField>
                <FormField :label="$t('message.approach.editable')">
                    <FormControl v-model="enfoque.editable" :icon="mdiListStatus" :options="option" />
                </FormField>                
            </div>
            <div class="grid md:grid-cols-1 gap-1">
                <FormField :label="$t('message.approach.status')">
                    <FormControl v-model="enfoque.estado" :icon="mdiListStatus" :options="selectOptions" />
                </FormField>
            </div>
            <template #footer>
                <BaseButton :label="$t(`message.submit`)" type="submit" color="success" />
                <BaseButton :label="$t(`message.cancel`)" color="info" style="margin-left: 5px;" @click="btnCerrarModalEnfoque"/>
            </template>
        </CardBox>
    </CardBoxModal>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiGlobeModel" :title="$t('message.approach.approaches')">
            </SectionTitleLineWithButton>
            <div class="container mx-auto">
                <div class="grid md:grid-cols-4 gap-4 flex items-center">
                    <BaseButton 
                        :icon="mdiPlus" 
                        :label="$t('message.add_new')"
                        color="success" small
                        @click="btnAgregarEnfoque" />
                    <BaseButton 
                        :icon="mdiPlus" 
                        :label="$t('message.edit')" 
                        color="success" small 
                        @click="btnEditarEnfoque"
                        />
                    <BaseButton 
                        :icon="mdiPlus" 
                        :label="$t('message.delete')" 
                        color="success" small 
                        @click="isModalDangerActive = true"/>
                    
                    
                </div>
            </div>
            <TreeItem :nodes="treeData" :selectedNodeId="state.selectedNodeId" @nodeSelected="handleNodeSelected" />            
        </SectionMain>
    </LayoutAuthenticated>
</template>