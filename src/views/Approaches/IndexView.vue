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
import { mdiCodeBraces, mdiRenameBox, mdiListStatus } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


const { t } = useI18n();
const toast = useToast();
let miembroList = ref([]);
const isModalActive = ref(false);
const hasModalValue = false;
const selectedItemEnfoque = ref({});
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
    areaPadre: "",
    ruta: "",
    visible: option[0],
    rcr: option[0],
    editable: option[0],
    estado: selectOptions[0],
    miembro: miembroList.value,
}
const enfoque = ref(dataInitial);


const treeData = ref()

onMounted(async () => {
    let listarMiembros = await membersServices.allMiembrosGet()
    const dataMiembros = listarMiembros?.data.miembros;
    miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));

    let listEnfoques = await enfoquesServices.index()
    const { enfoques } = listEnfoques
    treeData.value = enfoques[0]
    /*if (props.path === 'update') {
        const res = await clientsService.read(route.params);
        client.value = res.data
       const  { cargo, estado, industria, companiaListada,companiaRegulada } = res.data
        client.value.cargo = { id: cargo._id, label: cargo.nombre }
        client.value.industria = { id: industria._id, label: industria.nombre }
        client.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        client.value.estado = selectOptions.filter(status => status.id === estado)[0]
        client.value.companiaListada = selectOptions.filter(company => company.id === companiaListada)[0]
        client.value.companiaRegulada = selectOptions.filter(company => company.id === companiaRegulada)[0]
        client.value.miembro = _asignarOpcionesAlSelect(res.data?.miembro)
        selectedPais(ally.value.pais, res.data)
    }*/
});

const successMessage = props.path === 'create' ? t("message.approach.created.success") : t("message.approach.updated.success")
const errorMessage = props.path === 'create' ? t("message.approach.created.error") : t("message.approach.updated.error")

const submit = async () => {
    action(enfoque)
        .then(() => {
            const m = selectedItemEnfoque.value
            enfoqueChildren(m)            
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
    //return clientsService.update(data);
}

const successMessageSelectNode = t("message.approach.selectedNode")
const btnAgregarEnfoque = () => {
    path = "create";
    if (Object.keys(selectedItemEnfoque.value).length === 0) {
        toast.error(successMessageSelectNode)
    } else {
        isModalActive.value = true
    }
}

const selelctedItemTreeView = (m, i) => {
    asignarNodoPadre(m)
    if (!i.value) {
        enfoqueChildren(m)
    }
}


const addChild = async (i, m) => {
    //asignarNodoPadre(m)
    //m.children = []
    console.log(i)
    if (!i.value) {
        enfoqueChildren(m)
    }
}

const enfoqueChildren = async (m) => {
    //m.children = []
    const child = await enfoquesServices.getChildren(m._id)
    const itemsEnfoque = child?.data?.children || [];
    m.children = itemsEnfoque
}

const asignarNodoPadre = (selectedEnfoque) => {
    console.log(selectedEnfoque)
    selectedItemEnfoque.value = selectedEnfoque
    enfoque.value.areaPadre = selectedEnfoque._id
    enfoque.value.areaPadreNombre = selectedEnfoque.nombre
}


</script>

<template>
    <CardBoxModal v-model="isModalActive" title="Crear enfoque" :hasDone="hasModalValue">
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
                    <FormControl :name="'parentArea'" v-model="enfoque.areaPadreNombre" :icon="mdiCodeBraces" />
                </FormField>
                <FormField :label="$t('message.approach.route')">
                    <FormControl :name="'route'" v-model="enfoque.ruta" :icon="mdiCodeBraces" />
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
                    <FormControl v-model="enfoque.miembro" :icon="mdiListStatus" :options="miembroList" />
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
                    <BaseButton :icon="mdiPlus" :label="$t('message.add_new')" color="success" small
                        @click="btnAgregarEnfoque" />
                    <BaseButton to="branches/create" :icon="mdiPlus" :label="$t('message.edit')" color="success" small />
                    <BaseButton to="branches/create" :icon="mdiPlus" :label="$t('message.delete')" color="success" small />
                </div>
            </div>
            <ul>
                <TreeItem class="item" :model="treeData" @optionTreeSelected="selelctedItemTreeView"/>
            </ul>
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