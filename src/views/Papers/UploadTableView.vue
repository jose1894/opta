<script setup>
import { computed, ref, reactive, defineEmits, onMounted, } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiDelete, mdiUpload, mdiFire } from "@mdi/js";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import uploadService from '@/services/upload.service';

const { t } = useI18n();
const toast = useToast()
const router = useRouter();
const mainStore = useMainStore();
const selectedFile = ref([]);

const items = computed(() => mainStore.filesProjectApproaches.Uploads);
const total = computed(() => mainStore.filesProjectApproaches.total)

const itemsPaginated = computed(() =>
  items.value
);

const perPage = computed(() => mainStore.filesProjectApproaches.perPage);

const currentPage = computed(() => mainStore.filesProjectApproaches.page);

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

const btnDolownd = (file) => {
 uploadService.downloadFiled(file._id) 
}

const selectedItem = (file) => selectedFile.value = file

const successMessageDelete =  t("message.file.deleted.success")
const errorMessageDelete = t("message.file.deleted.error")
const deleteItem = async (file) => {
  selectedFile.value = file
  actionDelete()
    .then(() => {
      toast.success(successMessageDelete);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.file.deleted.erro")} ${err?.response?.data.msg}`)
    })
};

const actionDelete = () => {
  const { _id } = selectedFile.value
  return uploadService.delete(_id);
}

</script>

<template>
  <table>
    <thead>
      <tr>
        <th @click="sort('nombre')">{{ $t('message.file.name') }} </th>
        <th />
      </tr>

    </thead>
    <tbody>
      <tr  v-for="(file, index) in itemsPaginated" :key="file._id" @click="selectedItem(file)">
        <td :data-label="$t('message.file.name')">
          {{ file.nombre }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>

            <BaseButton 
              color="info" 
              :icon="mdiUpload"
              :messageTooltip="t('message.dolownd')" 
              small 
              @click="btnDolownd(file)"/>

            <BaseButton 
              color="info" 
              :icon="mdiDelete"
              :messageTooltip="t('message.delete')"  
              small  
              @click="deleteItem(file)"/>

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