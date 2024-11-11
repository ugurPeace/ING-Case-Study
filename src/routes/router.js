import { Router } from "@vaadin/router";

const outlet = document.getElementById("outlet");
const router = new Router(outlet);

router.setRoutes([
  { path: "/", component: "employee-list" },
  { path: "/add", component: "employee-form" },
  { path: "/edit/:id", component: "employee-form" },
]);
