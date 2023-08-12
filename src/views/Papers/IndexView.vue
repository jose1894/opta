<script setup>
import { ref, reactive, defineProps, } from 'vue';
import { mdiGlobeModel, mdiCodeBraces, mdiAccount } from '@mdi/js';
import CardBox from '@/components/CardBox.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from '@/components/SectionMain.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import { useMainStore } from '@/stores/main';
import Breadcrumb from '@/components/Breadcrumb.vue'
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import projectsService from '@/services/projects.service';
import ProjectTable from './ProjectTableView.vue';
import Autocomplete from "@/components/Autocomplete.vue";
import clientService from '@/services/clients.srvice'
import personalService from '@/services/personal.service'
import moment from 'moment';


const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
let personasList = ref([]);
let clientesList = ref([]);
const showFormField = ref(true);
const showFormFieldCliente = ref(false);

const showFormFieldPesona = ref(true);
const showFormFieldPer = ref(false);

const breadcrumbs = ref( [
        { name: 'Inicio' },
])

const format = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const props = defineProps({
    path: '',
    saveLabel: '',
    project: {}
})

const params = ref({
    cliente: '',
    idCliente: "",
    codigo: "",
    fecha: null,
    persona: '',
    idPersona: ''
});

const customElementsForm = reactive({
    switch: [],
});
const getProjects = (data) => {
    console.log(data)
    projectsService.index(data).then(response => {
        mainStore.projects = response
        page.value = response.page
        perPage.value = response.perPage
    })
}

getProjects({ page: page.value })

const onChangeSwtch = () => {
    endPointUse({ page: page.value })
}

const onChangePage = (page) => {
    endPointUse({ page })
}

const onSortPage = (sortBy, sortDesc) => {
    endPointUseSort({ sortBy, sortDesc });
}

const getProjectsDelete = (data) => {
    projectsService.getDelete(data).then(response => {
        mainStore.projects = response
        page.value = response.page
        perPage.value = response.perPage
    })
}
const endPointUse = (page) => {
    customElementsForm.switch.length === 0 ? getProjects({ page }) :
        getProjectsDelete({ page })
}

const endPointUseSort = (sortBy, sortDesc) => {
    customElementsForm.switch.length === 0 ? getProjects({ sortBy, sortDesc }) :
        getProjectsDelete({ sortBy, sortDesc })
}

const searchFunction = async searchTerm => {
    console.log(searchTerm)
    const searchText = (searchTerm === "") ? "default" : searchTerm;
    const response = await clientService.searchCliente(searchText);
    const data = response.data?.clientes || []
    return data;
};
const renderFunction = item => {
    let clientesListData = clientesList.value
    const i = clientesListData.filter((objeto) => {
        return Object.keys(objeto).some((clave) => clave === item._id)
    });
    (i.length === 0) ? addItem(item, 'New') : toast.error(`El registro ya fue seleccionado`);
};

const addItem = (item, action) => {
    params.value.cliente = item.nombreCompleto
    params.value.idCliente = item.id
    showFormField.value = !showFormField.value;
    showFormFieldCliente.value = !showFormFieldCliente.value;
}


const addItemPersona = (item, action) => {
    params.value.persona = item.nombreCompleto
    params.value.idPersona = item.id
    showFormFieldPesona.value = !showFormFieldPesona.value;
    showFormFieldPer.value = !showFormFieldPer.value;
}


const searchFunctionPersonal = async searchTerm => {
    const searchText = (searchTerm === "") ? "default" : searchTerm;
    const response = await personalService.searchPersona(searchText);
    const data = response.data?.personas || []
    return data;
};
const renderFunctionPersonal = item => {
    let personasListData = personasList.value
    const i = personasListData.filter((objeto) => {
        return Object.keys(objeto).some((clave) => clave === item._id)
    });
    (i.length === 0) ? addItemPersona(item, 'New') : toast.error(`El registro ya fue seleccionado`);
};

const toggleFormField = () => {
    showFormFieldCliente.value = !showFormFieldCliente.value;
    showFormField.value = !showFormField.value;
    params.value.cliente = ''
    params.value.idCliente = ''
    //searchFunction(params.value.cliente)
}

const toggleFormFieldPersona = () => {
    showFormFieldPesona.value = !showFormFieldPesona.value;
    showFormFieldPer.value = !showFormFieldPer.value;
    params.value.persona = ''
    params.value.idPersona = ''
    //searchFunctionPersonal(params.value.persona)
}

const enviarParametros = () => {
    console.log(params.value)
    const { idCliente, fecha, codigo, idPersona } = params.value    
    const date = fecha === null ? '' : moment(fecha).format('YYYY-MM-DD')
    if (idCliente === '' && fecha === null && codigo === '' && idPersona === '') {
        getProjects({ page: page.value })
    } else {
        const data = [
            {
                codigo,
                fecha: date,
                cliente: idCliente,
                socio: idPersona
            }
        ]
        getProjects({ page: page.value, q: data })
    }
}
</script>
<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiGlobeModel" :title="$t('message.project.papers')"></SectionTitleLineWithButton>
            <Breadcrumb :items="breadcrumbs" />
            <CardBox isForm @submit.prevent="submit" style="background: rgb(134 134 145 / 16%);">
                <div class="grid md:grid-cols-2 gap-4">
                    <FormField :label="$t('message.project.client')" v-if="showFormField" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <Autocomplete :placeholder="'Buscar...'" :search-function="searchFunction"
                            :render-function="renderFunction" :debounce-time="500">
                        </Autocomplete>
                    </FormField>

                    <FormField :label="$t('message.project.client')" v-if="showFormFieldCliente" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <FormControl :name="'name'" v-model="params.cliente" :icon="mdiCodeBraces"
                            @click="toggleFormField" />
                    </FormField>

                    <FormField :label="$t('message.project.code')" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <FormControl :name="'codigo'" v-model="params.codigo" :icon="mdiCodeBraces" />
                    </FormField>

                    <FormField :label="$t('message.project.date')" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <VueDatePicker v-model="params.fecha" :enable-time-picker="false" :format="format" />
                    </FormField>

                    <FormField :label="$t('message.project.partner')" v-if="showFormFieldPesona" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <Autocomplete :placeholder="'Buscar...'" :search-function="searchFunctionPersonal"
                            :render-function="renderFunctionPersonal" :debounce-time="500">
                        </Autocomplete>
                    </FormField>

                    <FormField :label="$t('message.project.partner')" v-if="showFormFieldPer" style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                        <FormControl :name="'name'" v-model="params.persona" :icon="mdiCodeBraces"
                            @click="toggleFormFieldPersona" />
                    </FormField>
                </div>
                <template #footer style="padding-top: 0.5rem;padding-bottom: 0.5rem;">
                    <BaseButton :label="$t(`message.search`)" color="success" @click="enviarParametros" />
                </template>
            </CardBox>

            <SectionTitleLineWithButton v-if="!mainStore?.projects" :icon="mdiTableOff" title="Empty variation" />
            <NotificationBar v-if="!mainStore?.projects" color="danger" :icon="mdiTableOff">
                <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
            </NotificationBar>
            <CardBox v-if="mainStore?.projects?.proyectos?.length" class="mb-6" has-table>
                <ProjectTable @changePage="onChangePage" @sort="onSortPage" />
            </CardBox>

            <CardBox v-else>
                <CardBoxComponentEmpty />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
