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
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import projectsService from '@/services/projects.service';
import ProjectTable from './ProjectTableView.vue';
import Autocomplete from "@/components/Autocomplete.vue";
import clientService from '@/services/clients.srvice'
import personalService from '@/services/personal.service'


const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
let personasList = ref([]);
let clientesList = ref([]);
const dateProject = ref(new Date());

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

const customElementsForm = reactive({
    switch: [],
});
const getProjects = (data) => {
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
    const searchText = (searchTerm === "") ? "default" : searchTerm;
    const response = await clientService.searchCliente(searchText);
    const data = response.data?.clientes || []
    return data;
};
const renderFunction = item => {
    let clientesListData = clientesList.value
    /*const i = personasListData.filter((objeto) => {
      return Object.keys(objeto).some((clave) => clave === item._id)
    });*/

};

const searchFunctionPersonal = async searchTerm => {
  const searchText = (searchTerm === "") ? "default" : searchTerm;
  const response = await personalService.searchPersona(searchText);
  const data = response.data?.personas || []
  return data;
};
const renderFunctionPersonal = item => {
  let personasListData = personasList.value
  /*const i = personasListData.filter((objeto) => {
    return Object.keys(objeto).some((clave) => clave === item._id)
  });*/
};
</script>
<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiGlobeModel" :title="$t('message.project.papers')">
            </SectionTitleLineWithButton>
            <CardBox isForm @submit.prevent="submit" style="background: rgb(134 134 145 / 16%);">
                <div class="grid md:grid-cols-2 gap-4">
                    <FormField :label="$t('message.project.client')">
                        <Autocomplete :placeholder="'Buscar...'" :search-function="searchFunction"
                            :render-function="renderFunction" :debounce-time="500">
                        </Autocomplete>
                    </FormField>

                    <FormField :label="$t('message.project.code')">
                        <FormControl :name="'codigo'" :icon="mdiCodeBraces" />
                    </FormField>

                    <FormField :label="$t('message.project.date')">
                        <VueDatePicker v-model="dateProject" :enable-time-picker="false" :format="format" />
                    </FormField>

                    <FormField :label="$t('message.project.partner')">
                        <Autocomplete :placeholder="'Buscar...'" :search-function="searchFunctionPersonal"
                            :render-function="renderFunctionPersonal" :debounce-time="500">
                        </Autocomplete>
                    </FormField>
                </div>
                <template #footer>
                    <BaseButton :label="$t(`message.search`)" type="submit" color="success" />
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
