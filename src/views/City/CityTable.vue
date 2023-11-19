<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { mdiFileEdit, mdiTrashCan, mdiRestore } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import citiesService from '@/services/cities.service';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean, 
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.cities.ciudades);
const total = computed(() => mainStore.cities.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const selectedCities = ref([]);

const perPage = computed(() => mainStore.cities.perPage);

const currentPage = computed(() => mainStore.cities.page);

const checkedRows = ref([]);

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
  router.push({name: 'CitiesUpdate', params: {id}})
}

const selectedItem = (state) => selectedCities.value = state

const dataName = () => {
  const { nombre } = selectedCities.value
  return nombre
}
const successMessage = t("message.city.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.city.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedCities.value
  return citiesService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedCities.value
  citiesService.restore(_id).then(() => {
      toast.success(t("message.city.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.city.restore.error")} ${err?.response?.data.msg}`)
    });
}
</script>

<template>
   <CardBoxModal 
      v-model="isModalDangerActive" 
      :title="$t('message.pleaseConfirm')" 
      button="danger" 
      @confirm="deleteItem" has-cancel>
    <strong>{{ $t('message.state.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    :title="$t('message.pleaseConfirm')"
    @confirm="activateItem">
    <strong>{{ $t('message.city.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.city.code') }}</th>        
        <th @click="sort('nombre')">{{ $t('message.city.name') }}</th>
        <th @click="sort('nombre')">{{ $t('message.city.state') }}</th>
        <th @click="sort('estado')">{{ $t('message.city.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(city, index) in itemsPaginated" :key="city._id" @click="selectedItem(city)">
        <td :data-label="$t('message.city.code')">
          {{ city.codigo }} 
        </td>
        <td :data-label="$t('message.city.state')">
          {{ city?.state?.nombre }}
        </td>
        <td :data-label="$t('message.city.name')">
          {{ city.nombre }}
        </td>
        <td :data-label="$t('message.city.status')">
          {{ $t(`message.city.statuses.${listStatusOption(city.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && city.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && city.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(city._id)"
            />

            <BaseButton 
              v-show="!checkDelete && city.estado !== 2" 
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
