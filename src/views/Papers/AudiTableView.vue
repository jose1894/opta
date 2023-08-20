<script setup>
import { computed, ref, reactive, defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiDelete, mdiUpload, mdiFire } from "@mdi/js";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useLayouteStore } from "@/stores/layoutStore.js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import riesgosServices from '@/services/riesgos.service';
import uploadService from '@/services/upload.service';
import FormFilePicker from "@/components/FormFilePicker.vue";
import UploadTableView from "./UploadTableView.vue";


const { t } = useI18n();
const pageFiles = ref(1);
const perPageFiles = ref(10);
const toast = useToast()
const router = useRouter();
const isModalActive = ref(false);
const isModalUploadActive = ref(false);
const mainStore = useMainStore();
const hasModalValue = false;
const storeLayoute = useLayouteStore();
const pathFile = ref(null);
const archivo = ref(null);
const enfoqueId = ref();
const { _id, codigo } = JSON.parse(localStorage.getItem('selectedProject'))
const props = defineProps({
  path: '',
  saveLabel: '',
  state: {}
})

const items = computed(() => mainStore.auditAproaches.enfoques);
const total = computed(() => mainStore.auditAproaches.total)


const perPage = computed(() => mainStore.auditAproaches.perPage);

const currentPage = computed(() => mainStore.auditAproaches.page);

const onChangePage = (pageFiles) => {
  const dataProject = JSON.parse(localStorage.getItem('selectedProject')) 
  getFilesProjectApproaches(dataProject._id, enfoqueId.value,{ pageFiles })
}

const onSortPage = (sortBy, sortDesc) => {
  const dataProject = JSON.parse(localStorage.getItem('selectedProject')) 
  getFilesProjectApproaches(dataProject._id, enfoqueId.value,{ sortBy, sortDesc });
}

const itemsPaginated = computed(() =>
  items.value
);

/* Sorting */
const currentSort = 'name';
const sortDesc = ref(false);
const dataInitial = {
  _id: '',
  indice: "",
  titulo: "",
  descripcion: "",
  proyecto: _id
}
const unidadRiesgo = ref(dataInitial);

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

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
  emit('changePage', page)
}
const btnFormUploadFile = async (approache) => {
  const { ruta, _id } = approache
  const dataProject = JSON.parse(localStorage.getItem('selectedProject'))  
  pathFile.value = `${dataProject.codigo}/${ruta}` 
  enfoqueId.value = _id
  getFilesProjectApproaches()
  setTimeout(() => {
    isModalUploadActive.value = true
  }, 10);
}

const getFilesProjectApproaches = (data) => {
  const dataProject = JSON.parse(localStorage.getItem('selectedProject'))  
    uploadService.read(dataProject._id, enfoqueId.value,data).then(response => {
      console.log(response)
        mainStore.filesProjectApproaches = response
        pageFiles.value = response.page
        perPageFiles.value = response.perPage
    })
}


const successMessageUpload = props.path === 'create' ? t("message.file.created.success") : t("message.file.updated.success")
const errorMessageUpload = props.path === 'create' ? t("message.file.created.error") : t("message.file.updated.error")
const submitUpload = async () => {
  actionUpload()
    .then(() => {
      isModalUploadActive.value = false
      //enfoque.value = dataInitial
      toast.success(successMessageUpload);
    })
    .catch(err => {
      console.log(err)
      if (err.response?.data?.msg) {
        toast.error(`${t("message.file.created.error")} ${err.response.data.msg}`)
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

const actionUpload = async () => {
  //$valid_ext = array("png","jpeg","jpg","pdf","txt","doc","docx");

  const formData = new FormData();
  formData.append('archivo', archivo.value);
  formData.append('ruta', pathFile.value);
  formData.append('nombre', archivo.value.name);
  formData.append('type', archivo.value.type);
  formData.append('proyecto', _id);
  formData.append('enfoque', enfoqueId.value);  
  return uploadService.create(formData);
}

const handleFileChange = (event) => {
  archivo.value = event.target.files[0];
};


const btnAddRiesgo = (approache) => {
  const { indice, _id } = approache
  unidadRiesgo.value.indice = _id
  unidadRiesgo.value.titulo = ''
  unidadRiesgo.value.descripcion = ''
  
  setTimeout(() => {
    isModalActive.value = true
  }, 10);
}
const successMessage = props.path === 'create' ? t("message.audit.created.success") : t("message.audit.updated.success")
const errorMessage = props.path === 'create' ? t("message.audit.created.error") : t("message.audit.updated.error")
const submit = async () => {
  action(unidadRiesgo)
    .then(() => {
      isModalActive.value = false
      //enfoque.value = dataInitial
      toast.success(successMessage);
    })
    .catch(err => {
      console.log(err)
      if (err.response?.data?.msg) {
        toast.error(`${t("message.audit.created.error")} ${err.response.data.msg}`)
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

const action = async (unidadRiesgo) => {
  const {
    _id,
    indice,
    titulo,
    descripcion,
    proyecto } = unidadRiesgo.value;

  const data = {
    _id,
    indice,
    titulo,
    descripcion,
    proyecto
  }
  if (props.path === 'create') {
    return riesgosServices.create(data)
  }
  return riesgosServices.update(data);
}

const tituloModal = () => { 
  const { _id, codigo } = JSON.parse(localStorage.getItem('selectedProject'))
  return codigo
}

const tituloProjectClientModal = () => { 
  const { cliente } = JSON.parse(localStorage.getItem('selectedProject'))
  return cliente?.nombre
}

</script>

<template>
  <CardBoxModal v-model="isModalUploadActive"  :hasDone="hasModalValue">    
    <CardBox style="padding: 0px;">
      <div >
      <h2 style="font-weight: 700;">
        {{  $t('message.project.project') }}: {{  tituloModal() }}
      </h2>
      <h2 class="c-element-h2">
        {{  $t('message.project.client') }}: {{  tituloProjectClientModal() }}
      </h2>
      <h2 class="c-element-h2">
        {{  $t('message.audit.uploadFile') }}
      </h2>
    </div> 
    <CardBox isForm @submit.prevent="submitUpload" class="bg-gray-200" style="padding: 0px;">
      <div class="mb-0">
        <label for="formFile" class="mb-0 inline-block text-neutral-700 dark:text-neutral-200">Default file input
          example</label>
        <input
          class="relative m-0 block w-full min-w-0 flex-auto 
          rounded border border-solid border-neutral-300 bg-clip-padding 
          px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition 
          duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden 
          file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 
          file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 
          file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] 
          hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary 
          focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 
          dark:file:text-neutral-100 dark:focus:border-primary"
          type="file" ref="archivo" @change="handleFileChange"/>
      </div>
      
      <template #footer style="padding: 0px;">
        <BaseButton :label="$t(`message.submit`)" type="submit" color="success"/>
      </template>
    </CardBox>    
    </CardBox>
    <CardBox v-if="mainStore?.filesProjectApproaches?.Uploads?.length" class="mb-6" has-table>
      <UploadTableView @changePage="onChangePage" @sort="onSortPage" />
    </CardBox>
    
  </CardBoxModal>
  <CardBoxModal v-model="isModalActive" :hasDone="hasModalValue">
    <div class="title-modal">
      <h2 style="font-weight: 700;">
        {{  $t('message.project.project') }}: {{  tituloModal() }}
      </h2>
      <h2 class="c-element-h2">
        {{  $t('message.project.client') }}: {{  tituloProjectClientModal() }}
      </h2>
      <h2 class="c-element-h2">
        {{  $t('message.audit.addRisk') }}
      </h2>
    </div>    
    <CardBox isForm @submit.prevent="submit">      
      <div class="grid md:grid-cols-1 gap-2">
        <FormField :label="$t('message.audit.title')">
          <FormControl :name="'indice'" v-model="unidadRiesgo.titulo" :icon="mdiCodeBraces" />
        </FormField>
        <FormField :label="$t('message.audit.description')">
          <FormControl :name="'descripcion'" v-model="unidadRiesgo.descripcion" :icon="mdiCodeBraces" />
        </FormField>
      </div>
      <template #footer>
        <BaseButton :label="$t(`message.submit`)" type="submit" color="success" />
      </template>
    </CardBox>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th @click="sort('indice')">{{ $t('message.audit.index') }} </th>
        <th @click="sort('nombre')">{{ $t('message.audit.description') }} </th>
        <th />
      </tr>

    </thead>
    <tbody>
      <tr v-for="(approache, index) in itemsPaginated" :key="approache._id">
        <td :data-label="$t('message.audit.index')">
          {{ approache.indice }}
        </td>
        <td :data-label="$t('message.audit.description')">
          {{ approache.nombre }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiFire" small @click="btnAddRiesgo(approache)" />

            <BaseButton color="info" :icon="mdiUpload" small @click="btnFormUploadFile(approache)" />

            <!-- <BaseButton color="info" :icon="mdiDelete" small /> -->

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
<style scoped>
.c-element-h2{
    margin-top: 0px!important;
    font-weight: 700;
}

.title-modal{
    background: #ddd;
    padding: 8px;
    border-radius: 6px;
}
</style>