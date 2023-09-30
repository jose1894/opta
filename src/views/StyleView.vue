<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStyleStore } from "@/stores/style.js";
import { gradientBgPurplePink } from "@/colors.js";
import SectionMain from "@/components/SectionMain.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import useLoadingOverlay from '../useLoading'

const { showLoading, hideLoading, isLoading } = useLoadingOverlay()
const styleStore = useStyleStore();

styleStore.setDarkMode(false);

const router = useRouter();

onMounted(() => {
  styleStore.setStyle('basic');
  showLoading()
  router.push("/dashboard").then(() => {
    hideLoading()
  });
});

</script>
<template>
  <LayoutGuest>
    <div :class="gradientBgPurplePink" class="flex min-h-screen items-center justify-center">
      <SectionMain>
        <loading-overlay :active="isLoading" :can-cancel="true" @cancel="onCancel">
          <img src="../css/imag/OIP.jpg" alt="Loading...">
        </loading-overlay>
      </SectionMain>
    </div>
  </LayoutGuest>
</template>
