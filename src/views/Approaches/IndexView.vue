<script setup>
import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref
} from 'vue';
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import CardBox from '@/components/CardBox.vue';
import TreeItem from '@/components/TreeItem.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from "@/components/SectionMain.vue";
import membersServices from '@/services/member.service';
import enfoquesServices from '@/services/enfoques.service';
import CardBoxModal from "@/components/CardBoxModal.vue";
import { mdiCodeBraces, mdiPlus, mdiListStatus } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


const { t } = useI18n();
const toast = useToast();
let miembroList = ref([]);
const isReadOnly = ref(true);
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

const selectOptions = [
    { id: 1, label: t('message.approach.statuses.active') },
    { id: 0, label: t('message.approach.statuses.inactive') },
    { id: 2, label: t('message.approach.statuses.deleted') },
];
const dataInitial = {
    _id: '',
    indice: 0,
    nombre: "",
    areaPadreNombre: "",
    rutaPadre: "",
    areaPadre: "",
    ruta: "",
    visible: option[0],
    rcr: option[0],
    editable: option[0],
    estado: selectOptions[0],
    miembro: miembroList.value,
}
const enfoque = ref(dataInitial);

const state = reactive({
    selectedNodeId: null,
});


const treeData = ref()

const chilItem = (data, enfoques=[]) => {
    const menu1 = data.map((item) => { 
    const child =  enfoques.filter((itemEnfo) => itemEnfo?.areaPadre === item._id)
        if(child.length > 0) {
            item.children = child 
            chilItem(child, enfoques)
        }
        //data.children = child
        return item
    })

}

onMounted(async () => {
    let listarMiembros = await membersServices.allMiembrosGet()
    const dataMiembros = listarMiembros?.data.miembros;
    miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));
    getEnfoques()
    if (props.path === 'update') {
        console.log(props.path)
    }    
});

const getEnfoques = (async () => {
    let listEnfoques = await enfoquesServices.index()
    const { enfoques } = listEnfoques
    const nodeFirst = enfoques.filter((item) => item.nombre === "Root");
    const dataEnfoques = enfoques.filter((item) => item.nombre !== "Root");
    const menu11= chilItem(nodeFirst, dataEnfoques)
    treeData.value = nodeFirst
});
const successMessage = props.path === 'create' ? t("message.approach.created.success") : t("message.approach.updated.success")
const errorMessage = props.path === 'create' ? t("message.approach.created.error") : t("message.approach.updated.error")

const submit = async () => {
    action(enfoque)
        .then(() => {
            const m = selectedItemEnfoque.value
            enfoqueChildren(m)
            //getEnfoques()
            isModalActive.value = false
            enfoque.value = dataInitial
            toast.success(successMessage);
        })
        .catch(err => {
            if (err.response.data?.msg) {
                toast.error(`${t("message.approach.created.error")} ${err.response.data.msg}`)
                return
            }

            if (err.response.data?.errors) {
                const errors = err.response.data.errors;
                let errorStr = '';
                debugger
                for (let attr of errors) {
                }
            }
        })

}

const action = async (enfoque) => {
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
        miembro } = enfoque.value;

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
        miembro: miembro.id
    }
    if (path === 'create') {
        return enfoquesServices.create(data)
    }
    return enfoquesServices.update(data);
}

const successMessageSelectNode = t("message.approach.selectedNode")
const btnAgregarEnfoque = () => {
    enfoque.value = dataInitial
    path = "create";
    if (Object.keys(selectedItemEnfoque.value).length === 0) {
        toast.error(successMessageSelectNode)
    } else {
        isModalActive.value = true
    }
}

const btnEditarEnfoque = async () => {
    path = "update";
    enfoque.value = selectedItemEnfoque.value
    const { visible, estado, rcr, editable, miembro, areaPadre, areaPadreNombre, rutaPadre }  = selectedItemEnfoque.value
    if(areaPadre) {
        //const res = await enfoquesServices.read(areaPadre);
        enfoque.value.areaPadre = (typeof areaPadre === "object") ? areaPadre._id : areaPadre
        enfoque.value.areaPadreNombre = (typeof areaPadre === "object") ? areaPadre.nombre : areaPadreNombre 
        enfoque.value.rutaPadre = (typeof areaPadre === "object") ? areaPadre.ruta : rutaPadre  
    }    
    enfoque.value.estado = selectOptions.filter(status => status.id === _isObject(estado))[0]
    enfoque.value.visible = option.filter(item => item.id === _isObject(visible))[0]
    enfoque.value.rcr = option.filter(item => item.id === _isObject(rcr))[0]
    enfoque.value.editable = option.filter(item => item.id === _isObject(editable))[0]
    enfoque.value.miembro = _asignarOpcionesAlSelect(miembro)
    isModalActive.value = true
}

const _isObject=(data) => { 
    return (typeof data === "object") ? data.id : data
};

const _asignarOpcionesAlSelect = (data) => { 
    return { id: data?._id || data.id, label: data?.nombre || data?.label } 
};

const selelctedItemTreeView = (m, i) => {
    asignarNodoPadre(m)
    if (!i.value) {
        enfoqueChildren(m)
    }
}


const addChild = async (i, m) => {
    if (!i.value) {
        enfoqueChildren(m)
    }
}

const enfoqueChildren = async (m) => {
   
}

const enfoqueChildren = async (m) => {
   m.children = []
   const child = await enfoquesServices.getChildren(m._id)
   const itemsEnfoque = child?.data?.children || [];
   m.children = itemsEnfoque
}

const asignarNodoPadre = (selectedEnfoque) => {
    selectedItemEnfoque.value = selectedEnfoque
    enfoque.value.areaPadre = selectedEnfoque._id
    enfoque.value.areaPadreNombre = selectedEnfoque.nombre
    enfoque.value.rutaPadre = selectedEnfoque.ruta
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
        console.log(treeData.value) 
        const dataT = treeData.value
        const dataDeleteId = selectedItemEnfoque.value.areaPadre

        const menu1 = dataT.map((item) => { 
            console.log(item)
   
        })

        toast.success(successMessageError);
    })
    .catch(err => {
      toast.error(`${t("message.approach.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const deleteEnfoqueById = () => {
    const { _id } = selectedItemEnfoque.value
    return enfoquesServices.delete(_id);
};


</script>

<template>
    <CardBoxModal 
        v-model="isModalDangerActive" 
        title="Please confirm" 
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
                <FormField :label="$t('message.approach.route')">
                    <FormControl :name="'route'" v-model="enfoque.ruta" :icon="mdiCodeBraces" :readonly="true"/>
                </FormField>
                <FormField :label="$t('message.approach.visible')">
                    <FormControl v-model="enfoque.visible" :icon="mdiListStatus" :options="option" />
                </FormField>
                <FormField :label="$t('message.approach.rcr')">
                    <FormControl v-model="enfoque.rcr" :icon="mdiListStatus" :options="option" />
                </FormField>
                <FormField :label="$t('message.approach.editable')">
                    <FormControl v-model="enfoque.editable" :icon="mdiListStatus" :options="option" />
                </FormField>
                <FormField :label="$t('message.approach.membership')">
                    <FormControl v-model="enfoque.miembro" :icon="mdiListStatus" :options="miembroList" :readonly="isReadOnly"/>
                </FormField>
                <FormField :label="$t('message.approach.status')">
                    <FormControl v-model="enfoque.estado" :icon="mdiListStatus" :options="selectOptions" />
                </FormField>
            </div>
            <template #footer>
                <BaseButton :label="$t(`message.submit`)" type="submit" color="info" />
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
            <!-- <TreeItem :nodes="treeData" @nodeSelected="handleNodeSelected" /> -->
            <TreeItem :nodes="treeData" :selectedNodeId="state.selectedNodeId" @nodeSelected="handleNodeSelected" />
            <!-- <ul>
                <li>
                    <TreeItem class="item" :model="treeData" @optionTreeSelected="selelctedItemTreeView"/>
                </li>                
            </ul> -->
        </SectionMain>
    </LayoutAuthenticated>
</template>

<!-- <template>
    <LayoutAuthenticated>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.approach.approaches')">
            <BaseButton
                to="branches/create"
                :icon="mdiPlus"
                :label="$t('message.add_new')"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionMain>
            <ul>
                <TreeItem class="item" :model="treeData"/>
            </ul>
        </SectionMain>
    </LayoutAuthenticated>

</template>

<style>
    .item {
        cursor: pointer;
        line-height: 1.5;
    }
    .bold {
        font-weight: bold;
    }
</style> -->