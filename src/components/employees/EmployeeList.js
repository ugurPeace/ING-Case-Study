import { LitElement, html, css } from "lit";
import { getEmployees, deleteEmployee } from "../../state/store";
import { t } from "../../localization/index.js";
import "fa-icons";

class EmployeeList extends LitElement {
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
      font-size: 14px;
      border-right: none;
      border-left: none;
      color: #656565;
    }
    th {
      background-color: #ffffff;
      color: #f15b15;
    }
    table td:nth-child(-n + 3) {
      font-weight: bold;
    }
    button {
      cursor: pointer;
      border: none;
      background-color: transparent;
    }

    tr.selected {
      background-color: #f0f0f0; /* Açık gri */
    }

    input[type="checkbox"] {
      cursor: pointer;
    }
    .view-buttons {
      display: flex;
      gap: 2px;
    }
    .view-buttons button {
      margin-right: 12px;
      border: none;
      font-family: "Font Awesome 5 Free";
      cursor: pointer;
    }

    /* Kart görünümü */
    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .card-header {
      font-weight: bold;
      margin-bottom: 8px;
    }
    .card-detail {
      margin: 4px 0;
    }
    .card-actions {
      margin-top: 8px;
    }
    .edit-btn,
    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #f15b15;
      margin-right: 8px;
    }
    /* Modal CSS Stili */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal.visible {
      display: flex;
    }

    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .modal-actions {
      margin-top: 20px;
    }

    .modal-actions button {
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
    }

    .modal-actions button:first-child {
      background-color: #f15b15;
      color: white;
    }

    .modal-actions button:last-child {
      background-color: #ddd;
    }

    @media (max-width: 898px) {
      th {
        display: none;
      }
      td {
        display: block;
      }
      td::before {
        content: attr(data-cell);
      }
      .search-container {
        flex-direction: column;
        gap: 10px;
      }
    }

    .pagination {
      margin: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pagination button {
      margin: 0 5px;
      padding: 10px;
      border: none;

      cursor: pointer;
      font-size: 12px;
      color: #5f5f5f;

      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pagination button.active {
      background-color: #f15b15;
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 50%;
    }
    .pagination .prev,
    .pagination .next {
      border-radius: 50%;
      color: #f15b15;
    }

    .pagination .prev:disabled,
    .pagination .next:disabled {
      cursor: not-allowed;
      color: #5f5f5f;
    }
    .search-container {
      margin: 10px 0;
      background-color: #ffffff;
      margin-left: 20px;
      display: flex;
      justify-content: space-between; /* Butonlar için alan bırakma */
      position: relative;
    }
    .search-container input {
      padding: 6px;
      padding-left: 32px;
      width: 250px;
      border: 1px solid #a8a8a8;
      border-radius: 4px;
      border-color: #f15b15;
    }
    .search-container input:focus {
      border-color: #f15b15;
      outline: none;
    }
    .search-container span {
      position: absolute;
      left: 4px; /* İkonun sol kenara yerleşmesini sağlar */
      top: 4px;
      font-size: 16px;
      color: #e3e3e3;
      font-family: "Font Awesome 5 Free";
    }
  `;

  static properties = {
    employees: { type: Array },
    filteredEmployees: { type: Array },
    currentPage: { type: Number },
    pageSize: { type: Number },
    searchQuery: { type: String },
    selectedRows: { type: Array },
    viewMode: { type: String }, // Eklenen özellik: Görünüm modu
    modalVisible: { type: Boolean },
    employeeToDelete: { type: Number },
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.currentPage = 1;
    this.pageSize = 12;
    this.searchQuery = "";
    this.selectedRows = [];
    this.modalVisible = false; // Modal başlangıçta gizli
    this.employeeToDelete = null;
    const urlParams = new URLSearchParams(window.location.search);
    this.viewMode = urlParams.get("viewMode") || "list"; // Varsayılan 'list'
    // viewMode'a göre pageSize ayarlanıyor
    if (this.viewMode === "list") {
      this.pageSize = 12;
    } else if (this.viewMode === "table") {
      this.pageSize = 15;
    }
  }

  // Tek bir changeViewMode fonksiyonu
  changeViewMode(newViewMode) {
    this.viewMode = newViewMode;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("viewMode", newViewMode); // Yeni viewMode'u URL'ye ekle

    // URL'yi güncelle
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${urlParams.toString()}`
    );

    // Sayfayı yenile
    window.location.reload(); // Sayfanın yenilenmesini sağlıyor
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();

    // Sayfa numarasını URL parametresinden alın
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get("page")) || 1; // Sayfa numarasını al ya da 1 olarak ayarla

    document.addEventListener("language-changed", this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get("page")) || 1; // Sayfa numarasını al ya da 1 olarak ayarla

    document.removeEventListener("language-changed", this.handleLanguageChange);
  }

  handleLanguageChange = () => {
    this.requestUpdate();
  };

  loadEmployees() {
    this.employees = getEmployees();
    this.filterEmployees();
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees.slice(start, end);
  }

  handleRowSelection(event, id) {
    if (event.target.checked) {
      this.selectedRows = [...this.selectedRows, id];
    } else {
      this.selectedRows = this.selectedRows.filter((rowId) => rowId !== id);
    }
  }

  isSelected(id) {
    return this.selectedRows.includes(id);
  }

  handleDelete(id) {
    this.employeeToDelete = id; // Silinecek çalışanın ID'sini sakla
    this.modalVisible = true; // Modal'ı göster
  }

  handleEdit(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentViewMode = urlParams.get("viewMode") || "list";

    // Edit sayfasına yönlendirme, viewMode ve currentPage parametreleriyle
    window.location.href = `/edit/${id}?page=${this.currentPage}&viewMode=${currentViewMode}`;
  }

  handleConfirmDelete() {
    if (this.employeeToDelete !== null) {
      deleteEmployee(this.employeeToDelete);
      this.loadEmployees(); // Çalışanları yeniden yükle
    }
    this.modalVisible = false; // Modal'ı kapat
    this.employeeToDelete = null;
  }

  handleCloseModal() {
    this.modalVisible = false; // Modal'ı kapat
    this.employeeToDelete = null;
  }

  changePage(page) {
    this.currentPage = page; // Sayfa numarasını güncelle

    // URL'yi manuel olarak güncelle
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url); // Sayfa yenilenmeden URL güncellenir
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1;
    this.filterEmployees();
  }

  filterEmployees() {
    if (this.searchQuery) {
      this.filteredEmployees = this.employees.filter((employee) =>
        `${employee.firstName} ${employee.lastName} ${employee.department} ${employee.position}`
          .toLowerCase()
          .includes(this.searchQuery)
      );
    } else {
      this.filteredEmployees = this.employees;
    }
  }

  changeViewMode(mode) {
    this.viewMode = mode; // Görünüm modunu state'e set et
    // URL'yi manuel olarak güncelle (isteğe bağlı)
    const url = new URL(window.location.href);
    url.searchParams.set("viewMode", mode); // viewMode parametresini URL'ye ekle
    window.history.pushState({}, "", url); // Sayfa yenilenmeden URL güncellenir
  }

  render() {
    return html`
      <!-- Modal HTML yapısı -->
      <div class="modal ${this.modalVisible ? "visible" : ""}">
        <div class="modal-content">
          <h2>${t("confirmDelete")}</h2>

          <div class="modal-actions">
            <button @click="${this.handleConfirmDelete}">${t("yes")}</button>
            <button @click="${this.handleCloseModal}">${t("no")}</button>
          </div>
        </div>
      </div>
      <!--Modal sonu  -->
      <div class="search-container">
        <input
          type="search"
          placeholder=${t("searchPlaceholder")}
          @input=${this.handleSearch}
          .value=${this.searchQuery}
        />
        <span
          ><fa-icon class="fas fa-magnifying-glass" size="1.5em"></fa-icon
        ></span>

        <i class="fas fa-magnifying-glass"></i>
        <div class="view-buttons">
          <button
            class=${this.viewMode === "list" ? "active" : ""}
            @click=${() => {
              this.changeViewMode("list");
              window.location.reload(); // Sayfanın yenilenmesi için burada ekleme yapıyoruz
            }}
          >
            <fa-icon class="fas fa-list" color="#f15b15" size="2em"></fa-icon>
          </button>
          <button
            class=${this.viewMode === "table" ? "active" : ""}
            @click=${() => {
              this.changeViewMode("table");
              window.location.reload(); // Sayfanın yenilenmesi için burada ekleme yapıyoruz
            }}
          >
            <fa-icon
              class="fas fa-table-cells"
              color="#f15b15"
              size="2em"
            ></fa-icon>
          </button>
        </div>

        <!-- list table butonları koyduk -->
      </div>
      <!-- table başlıyor -->
      ${this.viewMode === "list"
        ? html`
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>${t("firstName")}</th>
                  <th>${t("lastName")}</th>
                  <th>${t("employmentDate")}</th>
                  <th>${t("dateOfBirth")}</th>
                  <th>${t("Phone")}</th>
                  <th>${t("Email")}</th>
                  <th>${t("department")}</th>
                  <th>${t("position")}</th>
                  <th>${t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                ${this.paginatedEmployees.map(
                  (employee) => html`
                    <tr class=${this.isSelected(employee.id) ? "selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          @change=${(e) =>
                            this.handleRowSelection(e, employee.id)}
                          ?checked=${this.isSelected(employee.id)}
                        />
                      </td>
                      <td>${employee.firstName}</td>
                      <td>${employee.lastName}</td>
                      <td>${employee.employmentDate}</td>
                      <td>${employee.dateOfBirth}</td>
                      <td>${employee.phone}</td>
                      <td>${employee.email}</td>
                      <td>${employee.department}</td>
                      <td>${employee.position}</td>
                      <td>
                        <button @click=${() => this.handleEdit(employee.id)}>
                          <fa-icon
                            class="fas fa-pen-to-square"
                            color="#f15b15"
                            size="1em"
                          ></fa-icon>
                        </button>
                        <button @click=${() => this.handleDelete(employee.id)}>
                          <fa-icon
                            class="fas fa-trash"
                            color="#f15b15"
                            size="1em"
                          ></fa-icon>
                        </button>
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
            <div class="pagination">
              <button
                class="prev"
                ?disabled=${this.currentPage === 1}
                @click=${() => this.changePage(this.currentPage - 1)}
              >
                <fa-icon class="fas fa-angle-left" size="1.5em"></fa-icon>
              </button>

              ${Array(Math.ceil(this.filteredEmployees.length / this.pageSize))
                .fill()
                .map(
                  (_, index) => html`
                    <button
                      class="${this.currentPage === index + 1 ? "active" : ""}"
                      @click=${() => this.changePage(index + 1)}
                    >
                      ${index + 1}
                    </button>
                  `
                )}

              <button
                class="next"
                ?disabled=${this.currentPage ===
                Math.ceil(this.filteredEmployees.length / this.pageSize)}
                @click=${() => this.changePage(this.currentPage + 1)}
              >
                <fa-icon class="fas fa-angle-right" size="1.5em"></fa-icon>
              </button>
            </div>
          `
        : html`
            <div class="card-container">
              ${this.paginatedEmployees.map(
                (employee) => html`
                  <div class="card">
                    <div class="card-header">
                      ${employee.firstName} ${employee.lastName}
                    </div>
                    <div class="card-detail">
                      ${t("department")}: ${employee.department}
                    </div>
                    <div class="card-detail">
                      ${t("position")}: ${employee.position}
                    </div>
                    <div class="card-actions">
                      <button @click=${() => this.handleEdit(employee.id)}>
                        <fa-icon
                          class="fas fa-pen-to-square"
                          color="#f15b15"
                          size="1em"
                        ></fa-icon>
                      </button>
                      <button @click=${() => this.handleDelete(employee.id)}>
                        <fa-icon
                          class="fas fa-trash"
                          color="#f15b15"
                          size="1em"
                        ></fa-icon>
                      </button>
                    </div>
                  </div>
                `
              )}
            </div>

            <div class="pagination">
              <button
                class="prev"
                ?disabled=${this.currentPage === 1}
                @click=${() => this.changePage(this.currentPage - 1)}
              >
                <fa-icon class="fas fa-angle-left" size="1.5em"></fa-icon>
              </button>

              ${Array(Math.ceil(this.filteredEmployees.length / this.pageSize))
                .fill()
                .map(
                  (_, index) => html`
                    <button
                      class="${this.currentPage === index + 1 ? "active" : ""}"
                      @click=${() => this.changePage(index + 1)}
                    >
                      ${index + 1}
                    </button>
                  `
                )}

              <button
                class="next"
                ?disabled=${this.currentPage ===
                Math.ceil(this.filteredEmployees.length / this.pageSize)}
                @click=${() => this.changePage(this.currentPage + 1)}
              >
                <fa-icon class="fas fa-angle-right" size="1.5em"></fa-icon>
              </button>
            </div>
          `}
    `;
  }
}

customElements.define("employee-list", EmployeeList);
