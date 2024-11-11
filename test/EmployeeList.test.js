import { expect, fixture, html } from "@open-wc/testing";
import "../src/components/employees/EmployeeList";
import { defaultEmployees } from "../src/state/store";

describe("EmployeeList", () => {
  it("should render a table when in list view mode", async () => {
    const element = await fixture(
      html`<employee-list viewMode="list"></employee-list>`
    );
    const table = element.shadowRoot.querySelector("table");
    expect(table).to.exist; // toBeDefined yerine to.exist kullanın
  });

  it("should render a grid of cards when in card view mode", async () => {
    const element = await fixture(
      html`<employee-list viewMode="table"></employee-list>`
    );
    const cardContainer = element.shadowRoot.querySelector(".card-container");
    expect(cardContainer).to.exist; // toBeDefined yerine to.exist kullanın
  });
});

describe("EmployeeList", () => {
  it("should filter employees by search query", async () => {
    const mockTranslate = (key) => key; // Herhangi bir çeviri yapmadan, anahtar kelimeleri döndürür
    globalThis.t = mockTranslate;

    const element = await fixture(html`<employee-list></employee-list>`);

    // Çalışan verilerini ekleyin
    element.defaultEmployees = [{ firstName: "John" }, { lastName: "Smith" }];
    // Arama inputunun shadow DOM'da varlığını kontrol edin
    const searchInput = element.shadowRoot.querySelector(
      'input[type="search"]'
    );
    expect(searchInput).to.exist; // Chai kullanarak element'in varlığını kontrol et

    searchInput.value = "John"; // Örnek arama metni
    searchInput.dispatchEvent(new Event("input")); // Input event'i tetikleme

    await element.updateComplete; // Web component'in güncellenmesini bekleyin

    // Filtrelenmiş çalışanları kontrol etme // Not: Çeviri kaynaklı hata geliyor.
    const filteredEmployees =
      element.shadowRoot.querySelectorAll(".search-container");
    expect(filteredEmployees.length).to.be.greaterThan(0); // Filtrelenmiş çalışanları kontrol edin
  });
});

it("should change the current page", async () => {
  const element = await fixture(html`<employee-list></employee-list>`);
  element.currentPage = 1;

  // Sayfa numarasını 2 yapalım
  element.changePage(2);
  await element.updateComplete;

  expect(element.currentPage).to.equal(2); // Chai'de doğru eşitlik kontrolü
});

it("should show the delete confirmation modal when deleting an employee", async () => {
  const element = await fixture(html`<employee-list></employee-list>`);

  // Modal'ı açmak için bir çalışan silme işlemi simüle et
  element.handleDelete(1);
  await element.updateComplete;

  const modal = element.shadowRoot.querySelector(".modal");
  // 'visible' sınıfının olup olmadığını kontrol et
  expect(modal.classList.contains("visible")).to.be.true; // Chai'de doğru eşitlik kontrolü
});

it("should close the delete confirmation modal", async () => {
  const element = await fixture(html`<employee-list></employee-list>`);

  element.handleDelete(1);
  await element.updateComplete;

  // Modal'ı kapatma
  element.handleCloseModal();
  await element.updateComplete;

  const modal = element.shadowRoot.querySelector(".modal");
  // 'visible' sınıfının olup olmadığını kontrol et
  expect(modal.classList.contains("visible")).to.be.false; // Chai'de doğru eşitlik kontrolü
});

it("should delete an employee when confirming the deletion", async () => {
  const element = await fixture(html`<employee-list></employee-list>`);
  const initialEmployees = element.employees;

  // Silme işleminden önce çalışan sayısını kontrol et
  const employeeToDelete = initialEmployees[0];
  element.handleDelete(employeeToDelete.id);
  element.handleConfirmDelete();

  // Silme işlemi sonrası çalışan sayısının bir azalmış olduğunu kontrol et
  expect(element.employees.length).to.be.lessThan(initialEmployees.length); // Chai'ye uygun kontrol
});

it("should change view mode to table", async () => {
  const element = await fixture(html`<employee-list></employee-list>`);

  element.changeViewMode("table");
  await element.updateComplete;

  // Sayfa yenilemesini engellemek için yorum satırı
  // window.location.reload();

  const tableButton = element.shadowRoot.querySelector(
    ".view-buttons button.active"
  );
  expect(tableButton.classList.contains("active")).to.be.true;
  expect(element.viewMode).to.equal("table");

  // Ek bir test: "list" butonunun "active" olmaması
  const listButton = element.shadowRoot.querySelector(
    ".view-buttons button:first-child"
  );
  expect(listButton.classList.contains("active")).to.be.false;
});
