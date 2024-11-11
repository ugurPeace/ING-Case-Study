import { html, css, LitElement } from "lit";
import { Router } from "@vaadin/router";
import "./components/navigation/NavigationMenu.js";
import "./components/employees/EmployeeList.js";
import "./components/employees/EmployeeForm.js";
import "./components/LanguageSelector/LanguageSelector.js";

class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
  `;

  constructor() {
    super();
  }

  firstUpdated() {
    // Attach the router to the #outlet in the light DOM
    const outlet = this.renderRoot.querySelector("#outlet"); // `renderRoot` targets the rendered DOM
    const router = new Router(outlet);
    router.setRoutes([
      { path: "/", component: "employee-list" },
      { path: "/add", component: "employee-form" },
      { path: "/edit/:id", component: "employee-form" },
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>

      <!-- Dil seçici burada -->
      <div id="outlet"></div>
      <!-- Move this to light DOM -->
    `;
  }
}

customElements.define("employee-app", EmployeeApp);
