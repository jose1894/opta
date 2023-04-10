<script setup>
import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref
} from 'vue';
import { useI18n } from "vue-i18n";
import {
    mdiCodeBraces,
    mdiRenameBox,
    mdiListStatus
} from "@mdi/js";
import useValidate from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import CardBox from '@/components/CardBox.vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/FormField.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormControl from '@/components/FormControl.vue';
import expenseService from '@/services/expense.service';
import { required, maxLength } from '@/utils/i18n-validators';

const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const selectOptions = [
    { id: 1, label: t('message.expense.statuses.active') },
    { id: 0, label: t('message.expense.statuses.inactive') },
    { id: 2, label: t('message.expense.statuses.deleted') },
];

const expense = ref({
    _id: '',
    concepto: '',
    estado: selectOptions[0],
});

const rules = computed(() => ({
    concepto: { required, maxLength: maxLength(250) }
}));

const v$ = useValidate(rules, expense);

onMounted(async () => {
    if (props.path === 'update') {
        const res = await expenseService.read(route.params);
        expense.value = res.data
        expense.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    }
});

const action = (expense) => {
    const { _id,
        concepto,
        estado } = expense.value;

    const data = {
        _id,
        concepto,
        estado: estado.id
    }
    if (props.path === 'create') {
        return expenseService.create(data)
    }
    return expenseService.update(data);
}

const successMessage = props.path === 'create' ? t("message.expense.created.success") : t("message.expense.updated.success")
const errorMessage = props.path === 'create' ? t("message.expense.created.error") : t("message.expense.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(expense)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/expense');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
                    toast.error(`${errorMessage} ${err.response.data.msg}`)
                    return
                }

                if (err.response.data?.errors) {
                    const errors = err.response.data.errors;
                    let errorStr = '';
                    debugger
                    for (let attr of errors) {
                    }
                }
            })
    } else {
        console.log('error')
    }
};
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <div class="grid md:grid-cols-2 gap-2">
                    <FormField :label="$t('message.expense.concept')" :help="v$?.concept?.$errors[0]?.$message">
                        <FormControl v-model="expense.concepto" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.expense.status')" :help="v$?.estado?.$errors[0]?.$message">
                        <FormControl v-model="expense.estado" :icon="mdiListStatus" :options="selectOptions" />
                    </FormField>
                </div>
            </div>
        </div>
        <template #footer>
            <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
        </template>
    </CardBox>
</template>
<style scoped>
.btn-add-remove {
    display: grid;
    grid-template-columns: 1fr 50px 50px;
    margin: 10px 0;
}

.btn-add-remove button {
    background: #b0b0ba;
    height: 28px;
    color: white;
    font-size: 1rem;
    font-weight: 700;
    margin-right: 5px;
    border-radius: 50px;
}

.h2-tittle {
    font-size: 1.2rem;
    color: blue;
    font-weight: 500;
    margin-bottom: 10px;
    background: #b0b0ba;
    margin-right: 5px;
    padding-left: 8px;
    border-radius: 5px;
}

.btn-add-referidos:hover {
    background: blue;
}

.btn-remove-referidos:hover {
    background: red;
}
</style>

