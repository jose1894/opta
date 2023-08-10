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


const { t } = useI18n();
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
const props = defineProps({
  projectId: {
    type: String,
    required: true,
    default: ''
  },
  codigo: {
    type: String,
    required: true,
    default: ''
  },
  path: '',
  saveLabel: '',
  state: {}
})


/*const isAsideMobileExpanded = computed(() => {
  storeLayoute.toggleIsAsideLgActiveTrue(true)
  return storeLayoute.isAsideLgActive.value
});*/

const items = computed(() => mainStore.auditAproaches.enfoques);
const total = computed(() => mainStore.auditAproaches.total)


const perPage = computed(() => mainStore.auditAproaches.perPage);

const currentPage = computed(() => mainStore.auditAproaches.page);
const selectedProject = ref([]);

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
  proyecto: props.projectId
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
const btnFormUploadFile = (riskUnit) => {
  const { ruta, _id } = riskUnit
  pathFile.value = `${props.codigo}/${ruta}` 
  enfoqueId.value = _id
  setTimeout(() => {
    isModalUploadActive.value = true
  }, 10);
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
  formData.append('proyecto', props.projectId);
  formData.append('enfoque', enfoqueId.value);  
  return uploadService.create(formData);
}

const handleFileChange = (event) => {
  archivo.value = event.target.files[0];
  console.log(archivo.value  )

};


const btnAddRiesgo = (riskUnit) => {
  const { indice } = riskUnit
  unidadRiesgo.value.indice = indice
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

</script>

<template>
  <CardBoxModal v-model="isModalUploadActive" title="Subir archivo" :hasDone="hasModalValue">
    <CardBox>
  <CardBox isForm @submit.prevent="submitUpload">
      <div class="mb-3">
        <label for="formFile" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">Default file input
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
      <!-- <div class="grid md:grid-cols-1 gap-2">
        <FormField :label="$t('message.audit.title')">
          <input type="file" @change="handleFileChange"/>
        </FormField>
      </div> -->
      <template #footer>
        <BaseButton :label="$t(`message.submit`)" type="submit" color="success" />
      </template>
    </CardBox>
    </CardBox>
  </CardBoxModal>
  <CardBoxModal v-model="isModalActive" title="Crear riego" :hasDone="hasModalValue">
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

            <BaseButton color="info" :icon="mdiDelete" small />

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