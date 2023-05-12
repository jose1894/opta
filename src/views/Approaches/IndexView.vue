<script setup>
    import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref
} from 'vue';
    import { useI18n } from "vue-i18n";
    import { mdiGlobeModel } from '@mdi/js';
    import CardBox from '@/components/CardBox.vue';
    import TreeItem from '@/components/TreeItem.vue';
    import FormField from '@/components/FormField.vue';
    import FormControl from '@/components/FormControl.vue';
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from "@/components/SectionMain.vue";
    import membersServices from '@/services/member.service';
    import enfoquesServices from '@/services/enfoques.service';
    import CardBoxModal from "@/components/CardBoxModal.vue";
    import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


    const { t } = useI18n();
    let miembroList = ref([]);
    const isModalActive = ref(false);
    const hasModalValue = false;
    let path = '';
    const props = defineProps({
        path : '',
        saveLabel : '',
        state: {} 
    })

    const option  = [
        { id: 0, label: t('message.no') },
        { id: 1, label: t('message.yes') },        
    ];

    const selectOptions = [
    { id: 1, label: t('message.approach.statuses.active') },
    { id: 0, label: t('message.approach.statuses.inactive') },
    { id: 2, label: t('message.approach.statuses.deleted') },
];

    const enfoque = ref({
        _id: '',
        indice: 0,
        nombre: "",
        areaPadre: "",
        ruta: "",
        visible: option[0],
        rcr: option[0],
        editable: option[0],
        estado: selectOptions[0],
        miembro: miembroList.value,
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

onMounted(async () => {
    let listarMiembros = await membersServices.allMiembrosGet()
    const dataMiembros = listarMiembros?.data.miembros;
    miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));
    /*if (props.path === 'update') {
        const res = await clientsService.read(route.params);
        client.value = res.data
       const  { cargo, estado, industria, companiaListada,companiaRegulada } = res.data
        client.value.cargo = { id: cargo._id, label: cargo.nombre }
        client.value.industria = { id: industria._id, label: industria.nombre }
        client.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        client.value.estado = selectOptions.filter(status => status.id === estado)[0]
        client.value.companiaListada = selectOptions.filter(company => company.id === companiaListada)[0]
        client.value.companiaRegulada = selectOptions.filter(company => company.id === companiaRegulada)[0]
        client.value.miembro = _asignarOpcionesAlSelect(res.data?.miembro)
        selectedPais(ally.value.pais, res.data)
    }*/
});

const submit = async () => {
    console.log(enfoque)
    action(enfoque)

}

const action = (enfoque) => {
    const { _id,
        indice,
        nombre,
        areaPadre,
        ruta,
        visible,
        rcr,
        editable,
        estado,
        miembro } = enfoque.value;

    const data = {
        _id,
        indice,
        nombre,
        areaPadre,
        ruta,
        visible: visible.id,
        rcr: rcr.id,
        editable: editable.id,
        estado: estado.id,
        miembro: miembro.id
    }
    console.log(data)
    console.log(path)
}

const btnAgregarEnfoque = () => {
    isModalActive.value = true
    path="create"
    console.log(path)
} 

const selelctedItemTreeView = (i) => {
    alert("Crear enfoque")
    console.log(i)
}

</script>

<template>
    <CardBoxModal v-model="isModalActive" title="Crear enfoque" :hasDone="hasModalValue">
        <CardBox isForm @submit.prevent="submit" style="height: 500px;
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
                    <FormControl v-model="enfoque.visible" :icon="mdiListStatus" :options="option" />          
                </FormField> 
                <FormField :label="$t('message.approach.rcr')"> 
                    <FormControl v-model="enfoque.rcr" :icon="mdiListStatus" :options="option" />          
                </FormField> 
                <FormField :label="$t('message.approach.editable')">
                    <FormControl v-model="enfoque.editable" :icon="mdiListStatus" :options="option" />            
                </FormField> 
                <FormField :label="$t('message.approach.membership')">
                    <FormControl v-model="enfoque.miembro" :icon="mdiListStatus" :options="miembroList"/>            
                </FormField> 
                <FormField :label="$t('message.approach.status')">
                    <FormControl v-model="enfoque.estado" :icon="mdiListStatus" :options="selectOptions" />          
                </FormField> 
            </div> 
            <template #footer>
                <BaseButton :label="$t(`message.submit`)" type="submit" color="info" />
            </template>              
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
                  @click="btnAgregarEnfoque"
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
            <TreeItem class="item" :model="treeData" @optionTreeSelected="selelctedItemTreeView"/>
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