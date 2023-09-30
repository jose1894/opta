import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";
import CountriesRoutes from './CountriesRoutes.js';
import StatesRoutes from './StatesRoutes.js';
import CitiesRoutes from "./CitiesRoutes.js";
import Allies from "./Allies.js";
import MembersRoutes from "./MembersRoutes.js";
import JobsPositionRoutes from "./JobPositionRoutes.js";
import CurrenciesRoutes from "./CurrenciesRoutes.js";
import BranchesRoutes from "./BranchesRoutes.js";
import BusinessUnitRoutes from "./BusinessUnit.Routes.js";
import ExpenseRoutes from "./ExpenseRoutes.js";
import ProfileActionsRoutes from "./ProfileActionsRoutes.js";
import ItemsMenuRoutes from "./ItemsMenuRoutes.js";
import ProfilesRoutes from "./ProfilesRoutes.js";
import CategoryRoutes from "./CategoryRoutes.js";
import RatesRoutes from "./RatesRoute.js";
import LanguagesRoutes from "./LanguagesRoutes.js";
import ProfessionsRoutes from "./ProfessionsRoutes.js";
import PersonalRoutes from "./PersonalRoutes.js";
import IndustriesRoutes from "./IndustriesRoutes.js";
import ClientsRoutes from "./ClientsRoutes.js";
import ApproachesRoutes from "./ApproachesRoutes.js";
import ActivitiesRoutes from "./ActivitiesRoutes.js";
import projectsRoutes from "./ProjectsRoutes.js";
import PapersRoutes from "./PapersRoutes.js";

export default [
  {
    meta: {
      title: "Select style", requiresAuth: true
    },
    path: "/",
    name: "style",
    component: Style,
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard", requiresAuth: true
    },
    path: "/dashboard",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile", requiresAuth : true,
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
  ...CountriesRoutes,
  ...StatesRoutes,
  ...CitiesRoutes,
  ...Allies,
  ...JobsPositionRoutes,
  ...MembersRoutes,
  ...CurrenciesRoutes,
  ...BranchesRoutes,
  ...BusinessUnitRoutes,
  ...ExpenseRoutes,
  ...ProfileActionsRoutes,
  ...ItemsMenuRoutes,
  ...ProfilesRoutes,
  ...CategoryRoutes,
  ...RatesRoutes,
  ...LanguagesRoutes,
  ...ProfessionsRoutes,
  ...PersonalRoutes,
  ...IndustriesRoutes,
  ...ClientsRoutes,
  ...ApproachesRoutes,
  ...ActivitiesRoutes,
  ...projectsRoutes,
  ...PapersRoutes
];