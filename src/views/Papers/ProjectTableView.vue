<script setup>
import { computed, ref, reactive, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiTrashCan, mdiEyeCircleOutline } from "@mdi/js";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import moment from 'moment';




let personasList = ref([]);

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();
const hasModalValue = false;

const items = computed(() => mainStore.projects.proyectos);
const total = computed(() => mainStore.projects.total)


const perPage = computed(() => mainStore.projects.perPage);

const currentPage = computed(() => mainStore.projects.page);
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

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
  emit('changePage', page)
}

const selectedItem = (project) => selectedProject.value = project

const formatDate = (dateString, format) => {
    const date = moment(dateString).format(format)
  return date;
};

const goToAudit = (project) => {
  const {codigo, sucursal, _id } = project
  const { nombre  } = sucursal
  localStorage.setItem('selectedProject', JSON.stringify(project))
  router.push({name: 'AuditApproach', params: {codigo, nombre, _id}})
}
</script>

<template>
  <table>
    <thead>
      <tr>        
        <th @click="sort('codigo')">{{ $t('message.project.code') }}</th>
        <th @click="sort('cliente')">{{ $t('message.project.client') }}</th>
        <th @click="sort('socio')">{{ $t('message.project.partner') }}</th>
        <th >{{ $t('message.project.date') }}</th>
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
        <td :data-label="$t('message.project.date')">
          {{ formatDate(project.fecha, 'DD/MM/YYYY') }}
        </td>
        <td :data-label="$t('message.project.status')">
          {{ $t(`message.project.statuses.${listStatusOption(project.estado)}`) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons>
            <BaseButton 
              color="info" 
              :icon="mdiEyeCircleOutline" 
              :messageTooltip="t('message.redirect')" 
              small 
              @click="goToAudit(project)"
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