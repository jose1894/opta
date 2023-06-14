import i18n from "@/i18n";
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
  mdiCurrencyUsd,
  mdiFlag,
  mdiMapCheck,
  mdiMapMarker,
  mdiAccountDetails,
  mdiProfessionalHexagon,
  mdiAccountBox,
  mdiAccountStarOutline,
  mdiCheckbook,
  mdiNotebookCheck,
  mdiCubeOutline,
  mdiHandCoin,
  mdiArrowRightBold,
  mdiAccountCog,
  mdiListStatus,
  mdiSeal,
  mdiCash100,
  mdiSignLanguage,
  mdiLanguageMarkdownOutline,
  mdiEmoticonTongue,
  mdiEmoticonTongueOutline,
  mdiAccount,
  mdiFactory,
  mdiNaturePeople,
  mdiSourceBranch,
  mdiNewspaper,
  mdiAccountChild,
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
        icon: mdiCurrencyUsd
      },
      {
        label: "Countries",
        to: "/setup/countries",
        icon: mdiFlag
      },
      {
        label: "States",
        to: "/setup/states",
        icon: mdiMapCheck
      },
      {
        label: "Cities",
        to: "/setup/cities",
        icon: mdiMapMarker
      },
      {
        label: "Job-position",
        to: "/setup/jobPositions",
        icon:mdiAccountDetails
      },
      {
        label: "Allies",
        to: "/setup/allies",
        icon: mdiAccountCircle
      },
      {
        label: "Memberships",
        to: "/setup/memberships",
        icon: mdiAccountStarOutline
      },
      {
        label: "Branches",
        to: "/setup/branches",
        icon: mdiNotebookCheck
      },
      {
        label: "Bussiness units",
        to: "/setup/businessUnit",
        icon: mdiCubeOutline
      },
      {
        label: "Expense",
        to: "/setup/expense",
        icon:  mdiHandCoin
      },
      {
        label: 'User profile',
        icon: mdiAccountCog,
        menu: [
          {
            label: "Actions",
            to: "/setup/profileActions",
            icon:mdiArrowRightBold
          },
          {
            label: "Menu items",
            icon: mdiListStatus,
            to: "/setup/itemsMenu",
          },
          {
            label: "Profile",
            icon: mdiAccountBox,
            to: "/setup/profiles",
          },
        ]
      },
      {
        label: "Category",
        to: "/setup/categories",
        icon: mdiSeal
      },
      {
        label: "Rates",
        to: "/setup/rates",
        icon: mdiCash100
      },
      {
        label: "Language",
        icon: mdiEmoticonTongueOutline,
        to: "/setup/languages",
      },
      {
        label: "Profession",
        icon: mdiProfessionalHexagon,
        to: "/setup/professions",
      },
      {
        label: "Employees",
        icon:mdiAccount,
        to: "/setup/personal",
      },
      {
        label: "Industry",
        icon: mdiFactory,
        to: "/setup/industries",
      },
      {
        label: "Activities",
        icon:mdiAccountChild,
        to: "/setup/activities",
      },                 
    ],
  },
  {
    label: "Client",
    icon: mdiNaturePeople,
    to: "/setup/clients",
  },
  {
    label: "Approaches",
    icon: mdiSourceBranch,
    to: "/setup/approaches",
  },
  {
    label: "Projects",
    icon: mdiNewspaper,
    to: "/setup/projects",
  }
];


