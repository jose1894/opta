<script setup>
    import { ref } from 'vue';
    import { useI18n } from "vue-i18n";
    import { mdiGlobeModel } from '@mdi/js';
    import CardBox from '@/components/CardBox.vue';
    import TreeItem from '@/components/TreeItem.vue';
    import FormField from '@/components/FormField.vue';
    import FormControl from '@/components/FormControl.vue';
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from "@/components/SectionMain.vue";
    import CardBoxModal from "@/components/CardBoxModal.vue";
    import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


    const { t } = useI18n();
    const isModalActive = ref(false);
    const enfoque = ref({
        _id: '',
        indice: 0,
        nombre: "",
        areaPadre: "",
        ruta: "",
        visible: 0,
        rcr: 0,
        editable: 0,
        estado: 0,
        miembro: 0,
    });


    const treeData = ref({
        name: 'My Tree',
        id: '12',
        children: [
            { name: 'hello', id: '1'  },
            { name: 'world', id: '2'  },
            {
      name: 'child folder',
      id: '25',
      children: [
        {
          name: 'child folder',
          id: '30',
          children: [{ name: 'hello', id: '3'  }, { name: 'world', id: '4'  }]
        },
        { name: 'hello' },
        { name: 'world' },
        {
          name: 'child folder',
          id: '40',
          children: [{ name: 'hello', id: '6'  }, { name: 'world', id: '5'  }]
        }
      ]
    }
  ]
})

</script>

<template>
    <CardBoxModal v-model="isModalActive" title="Crear enfoque">
        <CardBox isForm @submit.prevent="submit" style="height: 450px;
                overflow-y: scroll;scroll-behavior: smooth;"> 
            <div class="grid md:grid-cols-2 gap-2">
                <FormField :label="$t('message.approach.indice')">
                <FormControl :name="'indice'" v-model="enfoque.indice" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.name')">
                <FormControl :name="'name'" v-model="enfoque.nombre" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.parentArea')">
                <FormControl :name="'parentArea'" v-model="enfoque.areaPadre" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.route')">
                <FormControl :name="'route'" v-model="enfoque.ruta" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.visible')">
                <FormControl :name="'visible'" v-model="enfoque.visible" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.rcr')">
                <FormControl :name="'rcr'" v-model="enfoque.rcr" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.editable')">
                <FormControl :name="'editable'" v-model="enfoque.editable" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.membership')">
                <FormControl :name="'membership'" v-model="enfoque.miembro" :icon="mdiCodeBraces" />            
            </FormField> 
            <FormField :label="$t('message.approach.code')">
                <FormControl :name="'codigo'" v-model="enfoque.estado" :icon="mdiCodeBraces" />            
            </FormField> 
            </div>               
        </CardBox>
  </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.approach.approaches')">            
        </SectionTitleLineWithButton>
        <div class="container mx-auto">
            <div class="grid md:grid-cols-4 gap-4 flex items-center">
                <BaseButton
                  :icon="mdiPlus"
                  :label="$t('message.add_new')"
                  color="success"
                  small
                  @click="isModalActive = true"
                />
                <BaseButton
                  to="branches/create"
                  :icon="mdiPlus"
                  :label="$t('message.edit')"
                  color="success"
                  small
                />
                <BaseButton
                  to="branches/create"
                  :icon="mdiPlus"
                  :label="$t('message.delete')"
                  color="success"
                  small
                />
            </div>
        </div>
        <ul>
            <TreeItem class="item" :model="treeData"/>
        </ul>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<!-- <template>
    <LayoutAuthenticated>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.approach.approaches')">
            <BaseButton
                to="branches/create"
                :icon="mdiPlus"
                :label="$t('message.add_new')"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionMain>
            <ul>
                <TreeItem class="item" :model="treeData"/>
            </ul>
        </SectionMain>
    </LayoutAuthenticated>

</template>

<style>
    .item {
        cursor: pointer;
        line-height: 1.5;
    }
    .bold {
        font-weight: bold;
    }
</style> -->