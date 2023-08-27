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
import clientsService from '@/services/clients.srvice';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean, 
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.clients.clientes);
const total = computed(() => mainStore.clients.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.clients.perPage);

const currentPage = computed(() => mainStore.clients.page);

const checkedRows = ref([]);

const selectedClient = ref([]);

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
  router.push({name: 'ClientsUpdate', params: {id}})
}

const selectedItem = (client) => selectedClient.value = client

const dataName = () => {
  const { nombre } = selectedClient.value
  return nombre
}
const successMessage = t("message.client.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.client.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedClient.value
  return clientsService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedClient.value
  clientsService.restore(_id).then(() => {
      toast.success(t("message.client.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.client.restore.error")} ${err?.response?.data.msg}`)
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
        <strong>{{ $t('message.client.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>


  <CardBoxModal 
    v-model="isModalActive" 
    title="Please confirm"
    @confirm="activateItem">
    <strong>{{ $t('message.client.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>


  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.client.code') }}</th>        
        <th @click="sort('nombre')">{{ $t('message.client.name') }}</th>
        <th @click="sort('idFiscal')">{{ $t('message.client.id') }}</th>
        <th @click="sort('estado')">{{ $t('message.client.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client._id" 
        @click="selectedItem(client)">
        <td :data-label="$t('message.client.code')">
          {{ client.codigo }} 
        </td>
        <td :data-label="$t('message.client.name')">
          {{ client.nombre }}
        </td>
        <td :data-label="$t('message.client.id')">
          {{ client.iDFiscal }}
        </td>
        <td :data-label="$t('message.client.status')">
          {{ $t(`message.client.statuses.${listStatusOption(client.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && client.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && client.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(client._id)"
            />

            <BaseButton 
              v-show="!checkDelete && client.estado !== 2" 
              color="danger" 
              :icon="mdiTrashCan"
              :messageTooltip="t('message.delete')" 
              small 
              @click="isModalDangerActive = true" />
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