<script setup>
import AsideMenuLayer from "@/components/AsideMenuLayer.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import { useLayouteStore  } from "@/stores/layoutStore.js";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean,
});

const storeLayoute = useLayouteStore ();

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
  emit("aside-lg-close-click", event);
};
</script>

<template>
  <AsideMenuLayer
    :menu="menu"
    :class="[
      storeLayoute.isAsideMobileExpanded  ? 'left-0' : '-left-60 lg:left-0',
      { 'lg:hidden xl:flex': !storeLayoute.isAsideLgActive },
    ]"
    @menu-click="menuClick"
    @aside-lg-close-click="asideLgCloseClick"
  />
  <OverlayLayer
    v-show="storeLayoute.isAsideLgActive"
    z-index="z-30"
    @overlay-click="asideLgCloseClick"
  />
</template>
