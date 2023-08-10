<script setup>
import {
    computed,
    defineProps,
    onMounted,
    reactive,
    ref
} from 'vue';

const props = defineProps({
    items: {
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
    },
})

const toggleDropdown = () => {
    console.log("vertical-navbar") 
    console.log(props.items ) 
    console.log("vertical-navbar")
  
      /*props.menuItems.forEach((item) => {
        if (item.id === itemId) {
          item.showDropdown = !item.showDropdown;
        } else {
          item.showDropdown = false;
        }
      });*/
    };

    const getDropdownStyle = () => {
        console.log("style") 
    console.log(props.items ) 
    console.log("style")
      return {
        right: `${props.parentWidth}px`,
        position: 'absolute',
      };
    };

    const getMenuLabelWidth = (label) => {
      return label.length * 8; // Assuming 8px per character
    };
</script>

<template  >
     <ul  class="dropdown" :style="getDropdownStyle(item)">
          <template v-for="(subItem, index) in items">
            <li v-if="subItem.dropdownItems" :key="subItem.id">
              <span class="submenu-label" @mouseover="toggleDropdown(subItem.id)" @click="toggleDropdown(subItem.id)">
                {{ subItem.label }}
              </span>
              <RecursiveItem :items="subItem.dropdownItems" :parentWidth="getMenuLabelWidth(subItem.label)" />
            </li>
            <li v-else :key="index">
              {{ subItem.label }}
            </li>
          </template>
        </ul>
  </template>

<style scoped>
.vertical-navbar {
  width: 200px;
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu li {
  cursor: pointer;
  margin-bottom: 10px;
}

.menu-label {
  display: inline-block;
}

.submenu-label {
  display: inline-block;
  cursor: pointer;
}

.dropdown {
  list-style-type: none;
  padding: 0;
  display: inline-block;
  position: absolute;
}
</style>