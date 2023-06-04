<script setup>
import {
    computed,
    defineProps,
    ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
})

const route = useRoute();
const router = useRouter();

const breadcrumbs = ref(props.items);

const navigate = (crumb) => {
    console.log(crumb)
    breadcrumbs.value = breadcrumbs.value.slice(0, breadcrumbs.value.indexOf(crumb) + 1);
};

const currentPath = computed(() => {
    return breadcrumbs.value.map(crumb => crumb.name).join(' > ');
});
</script>

<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" v-for="(crumb, index) in breadcrumbs" :key="index"
                :class="{ active: index === breadcrumbs.length - 1 }">
                <router-link v-if="crumb.link" :to="crumb.link">{{ crumb.name }}</router-link>
                <span v-else>{{ crumb.name }}</span>
            </li>
        </ol>
    </nav>
</template>
<style scoped>
.breadcrumb {
  background-color: #f5f5f5;
  padding: 8px 15px;
  margin-bottom: 20px;
  border-radius: 3px;
  font-size: 16px;
}

.breadcrumb li {
  display: inline-block;
}

.breadcrumb li+li:before {
  content: '\00bb';
  padding: 0 5px;
}

.breadcrumb .active {
  color: #555;
  font-weight: bold;
}
</style>