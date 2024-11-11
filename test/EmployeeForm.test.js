import { expect, fixture, html } from "@open-wc/testing";

import "../src/components/employees/EmployeeForm";

describe("EmployeeForm Component", () => {
  it("renders the form with initial values", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Form başlığını kontrol et
    const title = el.shadowRoot.querySelector("h1");
    expect(title.textContent).to.include("Add Employee");

    // İlk isim input alanının varlığını ve başlangıç değerini kontrol et
    const firstNameInput = el.shadowRoot.querySelector("#firstName");
    expect(firstNameInput).to.exist;
    expect(firstNameInput.value).to.equal("");

    // İlk render'da hata mesajlarının olmadığını kontrol et
    const errorMessages = el.shadowRoot.querySelectorAll(".error");
    expect(errorMessages.length).to.be.greaterThan(0);
    errorMessages.forEach((error) => {
      expect(error.textContent).to.equal("");
    });
  });

  it("shows validation errors on form submit", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Form gönderimini tetikle
    const form = el.shadowRoot.querySelector("form");
    form.dispatchEvent(new Event("submit"));

    // Hata mesajlarının doğru şekilde göründüğünü kontrol et
    await el.updateComplete; // Render güncellemesini bekleyin
    const firstNameError = el.shadowRoot.querySelector(".error");
    expect(firstNameError.textContent).to.include("First name is required");
  });

  it("updates state on user input", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Kullanıcı girişini simüle et
    const firstNameInput = el.shadowRoot.querySelector("#firstName");
    firstNameInput.value = "John";
    firstNameInput.dispatchEvent(new Event("input"));

    // State güncellemesini kontrol et
    expect(el.employee.firstName).to.equal("John");
  });

  it("opens and closes the confirmation modal", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Form gönderimini tetikle
    const form = el.shadowRoot.querySelector("form");
    form.dispatchEvent(new Event("submit"));

    el.modalVisible = true;
    await el.updateComplete; // Güncellemeyi bekle
    // Modal'ın göründüğünü kontrol et
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector(".modal-overlay");
    expect(modal).to.exist;

    // Modal'ı kapat
    const closeModalButton = el.shadowRoot.querySelector(
      ".modal-buttons button:last-child"
    );
    closeModalButton.click();

    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-overlay")).to.be.null;
  });
});
