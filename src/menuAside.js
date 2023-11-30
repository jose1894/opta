import i18n from "@/i18n";
import {
  mdiAccountCircle,
  mdiCog,
  mdiCurrencyUsd,
  mdiFlag,
  mdiMapCheck,
  mdiMapMarker,
  mdiAccountDetails,
  mdiProfessionalHexagon,
  mdiAccountBox,
  mdiAccountStarOutline,
  mdiNotebookCheck,
  mdiCubeOutline,
  mdiHandCoin,
  mdiArrowRightBold,
  mdiAccountCog,
  mdiListStatus,
  mdiSeal,
  mdiCash100,
  mdiEmoticonTongueOutline,
  mdiAccount,
  mdiFactory,
  mdiNaturePeople,
  mdiSourceBranch,
  mdiNewspaper,
  mdiAccountChild,
  mdiEarth,
  mdiNoteMultiple,
} from "@mdi/js";

export default [
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
        label: "Location",
        icon: mdiEarth,
        menu: [
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
        ]
      },
      {
        label: "Job-position",
        to: "/setup/jobPositions",
        icon: mdiAccountDetails
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
        icon: mdiHandCoin
      },
      /*{
        label: 'User profile',
        icon: mdiAccountCog,
        menu: [
          {
            label: "Actions",
            to: "/setup/profileActions",
            icon: mdiArrowRightBold
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
      },*/
      {
        label: "Category",
        to: "/setup/categories",
        icon: mdiSeal
      },
      /*{
        label: "Rates",
        to: "/setup/rates",
        icon: mdiCash100
      },*/
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
        icon: mdiAccount,
        to: "/setup/personal",
      },
      {
        label: "Industry",
        icon: mdiFactory,
        to: "/setup/industries",
      },
      {
        label: "Activities",
        icon: mdiAccountChild,
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
    menu: [
      {
        label: "Projects",
        icon: mdiNewspaper,
        to: "/setup/projects",
      },
      {
        label: "Papers",
        icon: mdiNoteMultiple,
        to: "/setup/papers",
      }
    ]
  }
];


