<script setup>
import { computed, ref, reactive, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan, mdiPlus } from "@mdi/js";
import personalService from '@/services/personal.service'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import CardBox from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import projectsService from '@/services/projects.service';
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import personProjectService from '@/services/personProject.service'
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";



defineProps({
  checkable: Boolean,
});

let personasList = ref([]);



const customElementsForm = reactive({
  radio: [],
});

const listarPersonas = computed(() =>
  personasList.value
);

const personaProyecto = ref([]);
const checkedRows = ref([]);
const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();
const hasModalValue = false;

const items = computed(() => mainStore.projects.proyectos);
const total = computed(() => mainStore.projects.total)

const isModalActive = ref(false);

const isModalAddUserProject = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.projects.perPage);

const currentPage = computed(() => mainStore.projects.page);

const selectedProject = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = { 0: 'inactive', 1: 'active', 2: 'deleted' };
  return statuses[status];
}
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
  router.push({ name: 'ProjectsUpdate', params: { id } })
}

const buscarPersonaProject = async (id) => {
  cancelDialog()
  const personas = await personProjectService.read(id)
  personas.data.personas.map((persona) => {
    addItem(persona, 'Update')
  })
  //addItem 
}

const selectedItem = (project) => selectedProject.value = project

const dataCodigo = (modal = false) => {
  const { codigo } = selectedProject.value
  return (!modal) ? codigo : `${t("message.project.project")} ${codigo}`
}
const successMessage = t("message.projectPerson.deleted.success")

const successMsg = t("message.projectPerson.created.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)
    })
    .catch(err => {
      toast.error(`${t("message.projectPerson.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const guardarPersonaProyeto = async () => {
  console.log('pasoooo')
  actionPersonaProyecto()
    .then(() => {
      toast.success(successMsg);
      emit('changePage', currentPage.value)
    })
    .catch(err => {
      toast.error(`${t("message.projectPerson.created.error")} ${err?.response?.data.msg}`)
    })
};

const cancelDialog = () => {
  personasList.value = []
  personaProyecto.value = []

};

const addUserProject = async () => {
  console.log(selectedProject.value)

};

const action = () => {
  const { _id } = selectedProject.value
  return projectsService.delete(_id);
}

const actionPersonaProyecto = () => {
  console.log(personaProyecto.value);
  return personProjectService.create(personaProyecto.value);

}

const searchFunction = async searchTerm => {
  // Realiza una conexión asincrónica para obtener los elementos filtrados
  //searchPersona
  const searchText = (searchTerm === "") ? "default" : searchTerm;
  const response = await personalService.searchPersona(searchText);
  const data = response.data?.personas || []
  return data;
};
const renderFunction = item => {
  // Define cómo se renderiza cada elemento seleccionado
  console.log(personasList.value)
  let personasListData = personasList.value
  const i = personasListData.filter((objeto) => {
    return Object.keys(objeto).some((clave) => clave === item._id)
  });
  (i.length === 0) ? addItem(item, 'New') : toast.error(`El registro ya fue seleccionado`);
};

const addItem = (item, action) => {
  const itemValue = action === 'New' ? item : item?.personaId
  const dataItem = [itemValue]
  const itemCheck = arrayItemMenu(dataItem)[0]
  personasList.value.push(itemCheck);
  const data = {
    _id: action === 'New' ? '' : item?._id,
    projectId: selectedProject.value._id,
    personaId: action === 'New' ? item._id : item?.personaId?._id,
    encargado: action === 'New' ? false : item?.encargado,
    persisteState: action,
  }
  personaProyecto.value.push(data)
  if (action === 'Update' && item?.encargado) {
    customElementsForm.radio = item?.personaId?._id
  }


}


const arrayItemMenu = (dataPersona) => dataPersona.map(({ _id, nombres, apellidos }) => ({ [_id]: `${nombres} ${apellidos}` }))

const onChangeCheckbox = (accionData) => {
  const valueId = customElementsForm.radio
  personaProyecto.value = personaProyecto.value.map((item) => {
    item.encargado = (valueId === item.personaId) ? true : false
    return item
  })
  console.log(personaProyecto.value)
}

const deletePersonaProyecto = async (accionData) => {
  const { _id } = selectedProject.value
  const data =  {
      personaId : Object.keys(accionData)[0],
      id : _id
    }
  const result = await personProjectService.delete(data)
  personaProyecto.value = []
  personasList.value = []
  const personas = await personProjectService.read(selectedProject.value)
  personas.data.personas.map((persona) => {
    addItem(persona, 'Update')
  })
  /*const personaData = personaProyecto.value
  const result = listarPersonas.value[0][valueId];
  const data21 = listarPersonas.value
  const result12 = Object.keys(data21).map(function (key, index) {
    const error = data21[key][valueId]
    if (error === undefined)  {
      return data21[key]
    }  
  }).filter(val => val !== undefined);*/
}

const checked = (isChecked, project) => {
  if (isChecked) {
    checkedRows.value.push(project);
    console.log(checkedRows)
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === project._id
    );
  }
};

</script>

<template>
  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" @confirm="deleteItem" has-cancel>
    <strong>{{ $t('message.project.deleted.question') }} <b> {{ dataCodigo() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal v-model="isModalAddUserProject" :title="dataCodigo(true)" button="danger" @confirm="guardarPersonaProyeto"
    @cancel="cancelDialog" has-cancel>

    <div class="grid md:grid-cols-1 gap-1">
      <FormField :label="$t('message.project.person')">
        <Autocomplete :placeholder="'Buscar...'" :search-function="searchFunction" :render-function="renderFunction"
          :debounce-time="500">
        </Autocomplete>
      </FormField>
    </div>
    <div class="grid md:grid-cols-1 gap-1">

      <h2> Encargado </h2>

    </div>
    <div class="grid md:grid-cols-1 gap-1">
      <FormField label="" v-for="(accionData, i) in listarPersonas">
        <FormCheckRadioGroup v-model="customElementsForm.radio" name="sample-radio" type="radio" isColumn="true"
          :options="listarPersonas[i]" @change="onChangeCheckbox(listarPersonas[i])" />
        <BaseButtons type="justify-start lg:justify-end" no-wrap>
          <BaseButton color="danger" :icon="mdiTrashCan" small style="width: 28px;height: 28px;"
            @click="deletePersonaProyecto(listarPersonas[i])" />
        </BaseButtons>
      </FormField>
    </div>
    <template #footer>
      <BaseButton :label="$t(`message.submit`)" color="success" />

    </template>
  </CardBoxModal>


  <table>
    <thead>
      <tr>
        <th />
        <th @click="sort('codigo')">{{ $t('message.project.code') }}</th>
        <th @click="sort('cliente')">{{ $t('message.project.client') }}</th>
        <th @click="sort('socio')">{{ $t('message.project.partner') }}</th>
        <th @click="sort('estado')">{{ $t('message.project.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(project, index) in itemsPaginated" :key="project._id" @click="selectedItem(project)">
        <TableCheckboxCell
          @checked="checked($event, project)"
        />
        <td :data-label="$t('message.project.code')">
          {{ project.codigo }}
        </td>
        <td :data-label="$t('message.project.client')">
          {{ project.cliente.nombre }}
        </td>
        <td :data-label="$t('message.project.partner')">
          {{ project.socio.nombres }}
        </td>
        <td :data-label="$t('message.project.status')">
          {{ $t(`message.project.statuses.${listStatusOption(project.estado)}`) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton 
              color="success" 
              :icon="mdiPlus" 
              :messageTooltip="t('message.assignPerson')"
              small
              @click="buscarPersonaProject(project), 
              isModalAddUserProject = true" />

            <BaseButton 
              color="info" 
              :icon="mdiFileEdit" 
              :messageTooltip="t('message.edit')"
              small 
              @click="edit(project._id)" />

            <BaseButton 
              color="danger" 
              :icon="mdiTrashCan" 
              :messageTooltip="t('message.delete')"
              small @click="isModalDangerActive = true"
              v-show="project.estado !== 2" />
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