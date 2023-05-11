import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiCog,
} from "@mdi/js";

export default [
  /*{
    to: "/dashboard",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    to: "/tables",
    label: "Tables",
    icon: mdiTable,
  },
  {
    to: "/forms",
    label: "Forms",
    icon: mdiSquareEditOutline,
  },
  {
    to: "/ui",
    label: "UI",
    icon: mdiTelevisionGuide,
  },
  {
    to: "/responsive",
    label: "Responsive",
    icon: mdiResponsive,
  },
  {
    to: "/",
    label: "Styles",
    icon: mdiPalette,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    to: "/login",
    label: "Login",
    icon: mdiLock,
  },
  {
    to: "/error",
    label: "Error",
    icon: mdiAlertCircle,
  },
  {
    label: "Dropdown",
    icon: mdiViewList,
    menu: [
      {
        label: "Item One",
      },
      {
        label: "Item Two",
      },
    ],
  },
  {
    to: "/tables",
    label: "Tables",
    icon: mdiTable,
  },
  {
    to: "/forms",
    label: "Forms",
    icon: mdiSquareEditOutline,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    to: "/login",
    label: "Login",
    icon: mdiLock,
  },*/
  {
    label: "SetUp",
    icon: mdiCog,
    menu: [
      {
        label: "Currency",
        to: "/setup/currencies",
      },
      {
        label: "Countries",
        to: "/setup/countries",
      },
      {
        label: "States",
        to: "/setup/states",
      },
      {
        label: "Cities",
        to: "/setup/cities",
      },
      {
        label: "Cargos",
        to: "/setup/jobPositions",
      },
      {
        label: "Allies",
        to: "/setup/allies",
      },
      {
        label: "Memberships",
        to: "/setup/memberships",
      },
      {
        label: "Branches",
        to: "/setup/branches",
      },
      {
        label: "Business unit",
        to: "/setup/businessUnit",
      },
      {
        label: "Expense",
        to: "/setup/expense",
      },
      {
        label: "Profile action",
        to: "/setup/profileActions",
      },
      {
        label: "Items menu",
        to: "/setup/itemsMenu",
      },
      {
        label: "Profile",
        to: "/setup/profiles",
      },
      {
        label: "Category",
        to: "/setup/categories",
      },
      {
        label: "Rate",
        to: "/setup/rates",
      },
      {
        label: "Language",
        to: "/setup/languages",
      },
      {
        label: "Profession",
        to: "/setup/professions",
      },
      {
        label: "Personnal",
        to: "/setup/personal",
      },
      {
        label: "Industry",
        to: "/setup/industries",
      },
      {
        label: "Client",
        to: "/setup/clients",
      },
      {
        label: "Approaches",
        to: "/setup/approaches",
      },             
    ],
  },
  {
    href: "https://github.com/justboil/admin-one-vue-tailwind",
    label: "GitHub",
    icon: mdiGithub,
    target: "_blank",
  },
  {
    href: "https://github.com/justboil/admin-one-react-tailwind",
    label: "React version",
    icon: mdiReact,
    target: "_blank",
  },
];
