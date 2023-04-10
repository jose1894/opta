<script setup>
    import { ref } from 'vue';
    import { mdiGlobeModel, mdiPlus } from '@mdi/js';  
    import CardBox from '@/components/CardBox.vue';      
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import NotificationBar from '@/components/NotificationBar.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import MemberTable from './MemberTable.view.vue';
    import { useMainStore } from '@/stores/main';
    import membersService from '@/services/member.service';

    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const members = ref([]);
    const getMembers = (data) => {
        membersService.index(data).then(response => {
            mainStore.members = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getMembers({page: page.value})

    const onChangePage = (page) => {
        getMembers({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        getMembers({sortBy,sortDesc});
    }  
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.member.members')">
            <BaseButton
                to="members/create"
                :icon="mdiPlus"
                :label="$t('message.add_new')"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionTitleLineWithButton v-if="!mainStore?.members" :icon="mdiTableOff" title="Empty variation"/>  
        <NotificationBar v-if="!mainStore?.members" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.members?.miembros?.length" class="mb-6" has-table>
            <MemberTable @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
