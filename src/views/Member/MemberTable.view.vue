<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import membersService from '@/services/member.service';

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.members.miembros);
const total = computed(() => mainStore.members.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.members.perPage);

const currentPage = computed(() => mainStore.members.page);

const checkedRows = ref([]);

const selectedMember = ref([]);

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
  router.push({name: 'MembershipsUpdate', params: {id}})
}

const selectedItem = (country) => selectedMember.value = country

const dataName = () => {
  const { nombre } = selectedMember.value
  return nombre
}
const successMessage = t("message.member.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.member.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedMember.value
  return membersService.delete(_id);
}
</script>

<template>
 <CardBoxModal 
      v-model="isModalDangerActive" 
      title="Please confirm" 
      button="danger" 
      @confirm="deleteItem" has-cancel>
      <strong>{{ $t('message.member.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.member.code') }}</th>        
        <th @click="sort('nambre')">{{ $t('message.member.name') }}</th>
        <th @click="sort('iDFiscal')">{{ $t('message.member.id') }}</th>
        <th @click="sort('estado')">{{ $t('message.member.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(member, index) in itemsPaginated" :key="member._id" @click="selectedItem(member)">
        <td :data-label="$t('message.member.code')">
          {{ member.codigo }} 
        </td>
        <td :data-label="$t('message.member.state')">
          {{ member.nombre }}
        </td>
        <td :data-label="$t('message.member.id')">
          {{ member.iDFiscal }}
        </td> 
        <td :data-label="$t('message.member.status')">
          {{ $t(`message.member.statuses.${listStatusOption(member.estado)}`) }}
        </td>      
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(member._id)"
            />

            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
              v-show="member.estado !== 2"
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