import { LitElement, html, css } from "lit";
import { addEmployee, updateEmployee, getEmployees } from "../../state/store";
import { t } from "../../localization/index.js"; // Çeviri fonksiyonunu ekledik

class EmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #f15b15;
      margin: 0px 4px 14px 0px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }
    .error {
      color: red;
      font-size: 12px;
      margin: 4px 0;
    }

    .close-btn {
      float: right;

      background: none;
      border: none;
      font-size: 32px;
      cursor: pointer;
      color: #f15b15;
    }
    .close-btn:hover {
      color: #f15b15;
    }
    label {
      margin-top: 10px;
      display: block;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 500;
    }
    select {
      border: 1px solid #f15b15;
      border-radius: 4px;
      width: 40%;
      padding: 6px;
      margin: 4px 0;
    }
    input {
      width: 50%;
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #f15b15;
      border-radius: 4px;
    }

    button {
      padding: 8px 12px;
      background-color: #f15b15;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      text-align: center;
    }
    .modal-buttons {
      margin-top: 20px;
    }
    .modal-buttons button {
      margin: 0 10px;
    }
  `;

  static properties = {
    employee: { type: Object },
    isEditMode: { type: Boolean },
    currentPage: { type: Number },
    errors: { type: Object },
    modalVisible: { type: Boolean },
  };

  constructor() {
    super();
    this.employee = {
      id: null,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      department: "",
      position: "",
      birthDate: "",
      employmentDate: "",
    };
    this.errors = {};
    this.isEditMode = false;
    this.currentPage = 1;
    this.modalVisible = false; // Modal görünürlüğü için
  }

  connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get("page")) || 1;
    const id = parseInt(this.location?.params?.id);
    if (id) {
      this.isEditMode = true;
      const employees = getEmployees();
      const employee = employees.find((emp) => emp.id === id);
      if (employee) this.employee = { ...employee };
    }
  }

  validateForm() {
    const errors = {};
    if (!this.employee.firstName) {
      errors.firstName = t("firstNameRequired");
    }
    if (!this.employee.lastName) {
      errors.lastName = t("lastNameRequired");
    }
    if (!this.employee.email) {
      errors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(this.employee.email)) {
      errors.email = t("invalidEmail");
    }
    if (!this.employee.phone) {
      errors.phone = t("phoneRequired");
    } else if (!/^\d+$/.test(this.employee.phone)) {
      errors.phone = t("invalidPhone");
    }
    if (!this.employee.department) {
      errors.department = t("departmentRequired");
    }
    if (!this.employee.position) {
      errors.position = t("positionRequired");
    }
    if (!this.employee.employmentDate) {
      errors.employmentDate = t("employmentDateRequired");
    }
    if (!this.employee.dateOfBirth) {
      errors.dateOfBirth = t("dateOfBirthRequired");
    }
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleClose() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get("viewMode") || "list"; // Varsayılan 'list' görünümü
    window.location.href = `/?page=${this.currentPage}&viewMode=${viewMode}`; // viewMode parametresiyle yönlendir
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }

    this.modalVisible = true; // Modal'ı göster
  }

  handleConfirmSubmit() {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (this.isEditMode) {
      const index = employees.findIndex((emp) => emp.id === this.employee.id);
      if (index !== -1) {
        employees[index] = { ...this.employee };
      }
      alert(
        t("employeeUpdated", {
          name: `${this.employee.firstName} ${this.employee.lastName}`,
        })
      );
    } else {
      this.employee.id = Date.now();
      employees.push(this.employee);
      alert(
        t("employeeAdded", {
          name: `${this.employee.firstName} ${this.employee.lastName}`,
        })
      );
    }
    localStorage.setItem("employees", JSON.stringify(employees));

    this.modalVisible = false; // Modal'ı kapat
    this.redirectToList();
    // Mevcut viewMode'u URL parametrelerinden al, eğer yoksa "list" olarak varsay
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get("viewMode") || "list"; // viewMode'yu kontrol et
    window.location.href = `/?page=${this.currentPage}&viewMode=${viewMode}`; // viewMode parametresiyle yönlendir
  }

  handleCloseModal() {
    this.modalVisible = false; // Modal'ı kapat
  }

  redirectToList() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get("viewMode") || "list";
    window.location.href = `/?page=1&viewMode=${viewMode}`; // Yönlendirme yap
  }
  /*   handleClose() {
    // URL'den mevcut viewMode parametresini al (varsayılan 'list' olarak ayarla)
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get("viewMode") || "list"; // Eğer viewMode yoksa, 'list' olarak varsayalım
    window.location.href = `/?page=${this.currentPage}&viewMode=${viewMode}`; // Yönlendirme yaparken viewMode'u kullan
  } */

  render() {
    return html`
      <div>
        <h1>
          ${this.isEditMode ? t("editEmployee") : t("addEmployee")}
          <button class="close-btn" @click=${this.handleClose}>×</button>
        </h1>
        <form @submit=${this.handleSubmit}>
          <label for="firstName">${t("firstName")}</label>
          <input
            type="text"
            id="firstName"
            .value=${this.employee.firstName}
            @input=${(e) => (this.employee.firstName = e.target.value)}
          />
          <div class="error">${this.errors.firstName || ""}</div>

          <label for="lastName">${t("lastName")}</label>
          <input
            type="text"
            id="lastName"
            .value=${this.employee.lastName}
            @input=${(e) => (this.employee.lastName = e.target.value)}
          />
          <div class="error">${this.errors.lastName || ""}</div>

          <label for="email">${t("email")}</label>
          <input
            type="email"
            id="email"
            .value=${this.employee.email}
            @input=${(e) => (this.employee.email = e.target.value)}
          />
          <div class="error">${this.errors.email || ""}</div>

          <label for="phone">${t("phone")}</label>
          <input
            type="tel"
            id="phone"
            .value=${this.employee.phone || ""}
            @input=${(e) => (this.employee.phone = e.target.value)}
          />
          <div class="error">${this.errors.phone || ""}</div>

          <label for="department">${t("department")}</label>
          <select
            id="department"
            .value=${this.employee.department}
            @change=${(e) => (this.employee.department = e.target.value)}
          >
            <option value="">${t("selectDepartment")}</option>
            <option value="Tech">${t("tech")}</option>
            <option value="Analytics">${t("analytics")}</option>
          </select>
          <div class="error">${this.errors.department || ""}</div>

          <label for="position">${t("position")}</label>
          <select
            id="position"
            .value=${this.employee.position}
            @change=${(e) => (this.employee.position = e.target.value)}
          >
            <option value="">${t("selectPosition")}</option>
            <option value="Junior">${t("junior")}</option>
            <option value="Medior">${t("medior")}</option>
            <option value="Senior">${t("senior")}</option>
          </select>
          <div class="error">${this.errors.position || ""}</div>

          <label for="employmentDate">${t("employmentDate")}</label>
          <input
            type="date"
            id="employmentDate"
            .value=${this.employee.employmentDate}
            @input=${(e) => (this.employee.employmentDate = e.target.value)}
          />
          <div class="error">${this.errors.employmentDate || ""}</div>

          <label for="dateOfBirth">${t("dateOfBirth")}</label>
          <input
            type="date"
            id="dateOfBirth"
            .value=${this.employee.dateOfBirth}
            @input=${(e) => (this.employee.dateOfBirth = e.target.value)}
          />
          <div class="error">${this.errors.dateOfBirth || ""}</div>

          <button type="submit" @click="${() => this.handleEdit(employee.id)}">
            ${this.isEditMode ? t("updateEmployee") : t("addEmployee")}
          </button>
          <!--           <button type="submit">${this.isEditMode
            ? t("updateEmployee")
            : t("addEmployee")}</button>
 -->
        </form>
        <!-- Modal confirmation -->
        ${this.modalVisible
          ? html`
              <div class="modal-overlay">
                <div class="modal-content">
                  <h2>${t("confirmSubmit")}</h2>
                  <p>${t("areYouSureSubmit")}</p>
                  <div class="modal-buttons">
                    <button @click=${this.handleConfirmSubmit}>
                      ${t("yes")}
                    </button>
                    <button @click=${this.handleCloseModal}>${t("no")}</button>
                  </div>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
