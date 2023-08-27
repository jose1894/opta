<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan, mdiRestore } from "@mdi/js";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import alliesService from '@/services/allies.service';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.allies.aliados);
const total = computed(() => mainStore.allies.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.allies.perPage);

const currentPage = computed(() => mainStore.allies.page);

const checkedRows = ref([]);

const selectedAlly = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = {0: 'inactive',1: 'active',2: 'deleted'};
  return statuses[status];
}
/* Sorting */
const currentSort = 'nombre';
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
  router.push({name: 'AlliesUpdate', params: {id}})
}

const selectedItem = (ally) => selectedAlly.value = ally

const dataName = () => {
  const { nombre } = selectedAlly.value
  return nombre
}
const successMessage = t("message.ally.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.ally.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedAlly.value
  return alliesService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedAlly.value
  
  alliesService.restore(_id).then(() => {
      toast.success(t("message.ally.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.ally.restore.error")} ${err?.response?.data.msg}`)
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
        <strong>{{ $t('message.ally.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    title="Please confirm"
    @confirm="activateItem">
    <strong>{{ $t('message.ally.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.ally.code') }}</th>        
        <th @click="sort('nombre')">{{ $t('message.ally.name') }}</th>
        <th @click="sort('idFiscal')">{{ $t('message.ally.id') }}</th>
        <th @click="sort('estado')">{{ $t('message.ally.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ally, index) in itemsPaginated" :key="ally._id" 
        @click="selectedItem(ally)">
        <td :data-label="$t('message.ally.code')">
          {{ ally.codigo }} 
        </td>
        <td :data-label="$t('message.ally.name')">
          {{ ally.nombre }}
        </td>
        <td :data-label="$t('message.ally.id')">
          {{ ally.iDFiscal }}
        </td>
        <td :data-label="$t('message.ally.status')">
          {{ $t(`message.ally.statuses.${listStatusOption(ally.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && ally.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')" 
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && ally.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(ally._id)"
            />

            <BaseButton 
              v-show="!checkDelete && ally.estado !== 2" 
              color="danger" 
              :icon="mdiTrashCan"
              :messageTooltip="t('message.delete')" 
              small 
              @click="isModalDangerActive = true" 
            />
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