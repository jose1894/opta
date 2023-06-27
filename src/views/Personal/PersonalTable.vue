<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan, mdiRestore } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import personalService from '@/services/personal.service'

defineProps({
  checkable: Boolean,
  checkDelete: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.personal?.personas);
const total = computed(() => mainStore.personal.total)


console.log(items)
const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.personal.perPage);

const currentPage = computed(() => mainStore.personal.page);

const checkedRows = ref([]);

const selectedPersonal = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = {0: 'inactive',1: 'active',2: 'deleted'};
  return statuses[status];
}
/* Sorting */
const currentSort = 'name';
const sortDesc = ref(false);

const sort = (s) => {
  sortDesc.value = !sortDesc.value;
  emit('sort',s, sortDesc.value);
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

const edit = (id) => {
  router.push({name: 'PersonalesUpdate', params: {id}})
}

const selectedItem = (persona) => selectedPersonal.value = persona

const dataName = () => {
  const { nombres, apellidos } = selectedPersonal.value
  return nombres + apellidos
}
const successMessage = t("message.personal.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.personal.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedPersonal.value
  return personalService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedPersonal.value
  personalService.restore(_id).then(() => {
      toast.success(t("message.personal.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.personal.restore.error")} ${err?.response?.data.msg}`)
    });
}
</script>

<template>

<CardBoxModal 
    v-model="isModalDangerActive" 
    title="Please confirm"
     button="danger" 
     @confirm="deleteItem" 
     has-cancel>
    <strong>{{ $t('message.personal.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    title="Please confirm"
    @confirm="activateItem">
    <strong>{{ $t('message.personal.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>
  

  <table>
    <thead>
      <tr>
        <th @click="sort('nombres')">{{ $t('message.personal.names') }}</th>
        <th @click="sort('apellidos')">{{ $t('message.personal.surnames') }}</th>
        <th @click="sort('estado')">{{ $t('message.personal.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(persona, index) in itemsPaginated" 
          :key="persona._id" @click="selectedItem(persona)">        
        <td :data-label="$t('message.personal.names')">
          {{ persona.nombres }} 
        </td>
        <td :data-label="$t('message.personal.surnames')">
          {{ persona.apellidos }}
        </td>
        <td :data-label="$t('message.personal.status')">
          {{ $t(`message.personal.statuses.${listStatusOption(persona.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && persona.estado === 2"
              color="success"
              :icon="mdiRestore"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && persona.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(persona._id)"
            />

            <BaseButton v-show="!checkDelete && persona.estado !== 2" color="danger" :icon="mdiTrashCan" small @click="isModalDangerActive = true" />
          
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === (currentPage-1)"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="changePage(page+1)"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>