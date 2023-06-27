<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan, mdiPlus } from "@mdi/js";
import personalService from '@/services/personal.service'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import CardBox from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import projectsService from '@/services/projects.service';
import FormField from "@/components/FormField.vue"; 
import FormControl from "@/components/FormControl.vue"; 


defineProps({
  checkable: Boolean,
});
const dataInitial = {
    _id: '',
    indice: 0,
    nombre: "",
    areaPadreNombre: "",
    rutaPadre: "",
    areaPadre: "",
    ruta: "",
}
const enfoque = ref(dataInitial);

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();
const hasModalValue = false;

const items = computed(() => mainStore.projects.proyectos);
const total = computed(() => mainStore.projects.total)

const isModalActive = ref(false);

const isModalAddUserProject = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.projects.perPage);

const currentPage = computed(() => mainStore.projects.page);

const checkedRows = ref([]);

const selectedProject = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = { 0: 'inactive', 1: 'active', 2: 'deleted' };
  return statuses[status];
}
/* Sorting */
const currentSort = 'name';
const sortDesc = ref(false);

const sort = (s) => {
  sortDesc.value = !sortDesc.value;
  emit('sort', s, sortDesc.value);
}
/* Sorting */

const numPages = computed(() => Math.ceil(total.value / perPage.value));

const currentPageHuman = computed(() => +currentPage.value);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
  emit('changePage', page)
}

const edit = (id) => {
  router.push({ name: 'ProjectsUpdate', params: { id } })
}

const selectedItem = (project) => selectedProject.value = project

const dataCodigo = () => {
  const { codigo } = selectedProject.value
  return codigo
}
const successMessage = t("message.project.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)
    })
    .catch(err => {
      toast.error(`${t("message.project.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const addUserProject = async () => {
  console.log(selectedProject.value)

};

const action = () => {
  const { _id } = selectedProject.value
  return projectsService.delete(_id);
}

const searchFunction = async searchTerm => {
  // Realiza una conexión asincrónica para obtener los elementos filtrados
  const response = await personalService.allPersona();
  const data = response.data?.personas || []//await response.json();
  return data;
};

const renderFunction = item => {
  // Define cómo se renderiza cada elemento seleccionado
  console.log(item);
};
</script>

<template>
  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" @confirm="deleteItem" has-cancel>
    <strong>{{ $t('message.project.deleted.question') }} <b> {{ dataCodigo() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal v-model="isModalAddUserProject" title="Please confirm" button="danger" @confirm="deleteItem" has-cancel>

    <div class="grid md:grid-cols-1 gap-1">
      <FormField :label="$t('message.approach.indice')">
        <Autocomplete 
          :placeholder="'Buscar...'" 
          :search-function="searchFunction" 
          :render-function="renderFunction" 
          :debounce-time="500">
        </Autocomplete>
      </FormField>
    </div>      
      <template #footer>
                
      </template> 
  </CardBoxModal>


  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.project.code') }}</th>
        <th @click="sort('cliente')">{{ $t('message.project.client') }}</th>
        <th @click="sort('socio')">{{ $t('message.project.partner') }}</th>
        <th @click="sort('estado')">{{ $t('message.project.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(project, index) in itemsPaginated" :key="project._id" @click="selectedItem(project)">
        <td :data-label="$t('message.project.code')">
          {{ project.codigo }}
        </td>
        <td :data-label="$t('message.project.client')">
          {{ project.cliente.nombre }}
        </td>
        <td :data-label="$t('message.project.partner')">
          {{ project.socio.nombres }}
        </td>
        <td :data-label="$t('message.project.status')">
          {{ $t(`message.project.statuses.${listStatusOption(project.estado)}`) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="success" :icon="mdiPlus" small @click="isModalAddUserProject = true" />
            <BaseButton color="info" :icon="mdiFileEdit" small @click="edit(project._id)" />

            <BaseButton color="danger" :icon="mdiTrashCan" small @click="isModalDangerActive = true"
              v-show="project.estado !== 2" />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton v-for="page in pagesList" :key="page" :active="page === (currentPage - 1)" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="changePage(page + 1)" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>