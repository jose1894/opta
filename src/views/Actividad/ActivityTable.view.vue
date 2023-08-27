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
import activitiesService from '@/services/activities.service';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.activities.actividades);
const total = computed(() => mainStore.activities.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.activities.perPage);

const currentPage = computed(() => mainStore.activities.page);

const checkedRows = ref([]);

const selectedActivity = ref([]);

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
  router.push({name: 'ActivitiesUpdate', params: {id}})
}

const selectedItem = (activityy) => selectedActivity.value = activityy

const dataName = () => {
  const { nombre } = selectedActivity.value
  return nombre
}
const successMessage = t("message.activity.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.activity.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedActivity.value
  return activitiesService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedActivity.value
  activitiesService.restore(_id).then(() => {
      toast.success(t("message.activity.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.activity.restore.error")} ${err?.response?.data.msg}`)
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
        <strong>{{ $t('message.activity.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    title="Please confirm"
    @confirm="activateItem">
    <strong>{{ $t('message.activity.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>

  <table>
    <thead>
      <tr>    
        <th @click="sort('nombre')">{{ $t('message.activity.name') }}</th>
        <th @click="sort('siglas')">{{ $t('message.activity.acronyms') }}</th>
        <th @click="sort('estado')">{{ $t('message.activity.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(activity, index) in itemsPaginated" :key="activity._id" 
        @click="selectedItem(activity)">
        <td :data-label="$t('message.activity.name')">
          {{ activity.nombre }}
        </td>
        <td :data-label="$t('message.activity.acronyms')">
          {{ activity.siglas }}
        </td>
        <td :data-label="$t('message.activity.status')">
          {{ $t(`message.activity.statuses.${listStatusOption(activity.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && activity.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')" 
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && activity.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(activity._id)"
            />

            <BaseButton 
              v-show="!checkDelete && activity.estado !== 2" 
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