
<script setup>
import {
  computed,
  defineProps,
  onMounted,
  reactive,
  ref
} from 'vue';

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  isSubMenu: {
    type: Boolean,
    default: false,
  },
  parentWidth: {
    type: Number,
    required: true,
    default: 200,
  },
})

const myLiElement = ref(null);
const myLiElement2 = ref(null);
const isMenuOpen = ref(false);
const isSubMenuOpen = ref([]);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSubMenu = (index) => {
  isSubMenuOpen.value[index] = !isSubMenuOpen.value[index];
};

const toggleDropdown = (itemId) => {
  const item = props.menuItems.find(item => item.id === itemId);
  if (item) {
    item.showDropdown = !item.showDropdown;
  }
}

const classObject = () => {
  if (!props.isSubMenu) {
    return {
      'dropdown-content': !props.isSubMenu,
      'relative': !props.isSubMenu,
      'block': !props.isSubMenu,
      'text-gray-700': !props.isSubMen,
      'pt-1': !props.isSubMenu,
      'width': '200px',
    };

  } else {
    return {
      'right': `${props.parentWidth}px`,
      'dropdown-content': props.isSubMenu,
      'absolute': props.isSubMenu,
      'text-gray-700': props.isSubMen,
      'pl-7': props.isSubMenu,
      'ml-24': props.isSubMenu,
      '-mt-10': props.isSubMenu,
      'width': `${props.parentWidth}px`,
    };
  }
}
const getMenuLabelWidth = (label) => {
  return label.length * 8; // Assuming 8px per character
};

const getDropdownStyle = (item) => {
  if (item.showDropdown) {
    // const liElement = e.target;
    const parentWidth = props.parentWidth;
    /* const parentTop = liElement.offsetTop;
     const parentLeft = liElement.offsetLeft;
     const dropdownLeft = parentLeft + parentWidth + 10;*/
    return {
      width: `${parentWidth}px`,
      position: 'absolute',
      top: `${parentTop}px`,
      // left: `${dropdownLeft}px`,
    };
  } else {
    return {
      display: 'none',
    };
  }
};

const handleClick = (item) => {
  const liElement = document.querySelector(`#myLiElement-${item._id}`);
  if (liElement) {
    console.log(liElement.offsetTop, item.nombre);
    const parentWidth = props.parentWidth;
    const parentTop = liElement.offsetTop;
     const parentLeft = liElement.offsetLeft;
     const dropdownLeft = parentLeft + parentWidth + 10;
     console.log(dropdownLeft);
    return {
      width: `${parentWidth}px`,
      top: `${parentTop}px`,
      left: `${dropdownLeft}px`,
    };
  }
};
</script>

<template>
  <ul :class="classObject()">
    <div class="content">
      <li v-for="(item, index) in menuItems" :key="index"
        :class="{ 'dropdown': item.children.length > 0, 'red': item.children.length === 0 }"
        :id="`myLiElement-${item._id}`" @mouseover="handleClick(item)">
        <span class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">
          {{ item.nombre }}
        </span>
        <RecursiveMenuItem v-if="item.children.length > 0" :menuItems="item.children" :isSubMenu="true" />
      </li>
    </div>

  </ul>
</template>

<style scoped>
.dropdown:hover>.dropdown-content {
  display: block;

}

.content {
  padding-right: 50px;
  /* Espacio para el elemento secundario */
}
</style>