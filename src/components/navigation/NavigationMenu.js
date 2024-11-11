import { LitElement, html, css } from "lit";
import { t } from "../../localization/index.js";
import "../LanguageSelector/LanguageSelector";
import "fa-icons";

class NavigationMenu extends LitElement {
  static styles = css`
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f6f6f6;
      padding: 10px;
      font-family: Arial, Helvetica, sans-serif;
    }
    img {
      width: 50px;
      height: auto;
    }
    a {
      text-decoration: none;
      color: #f15b15;
      margin: 0 10px;
      font-weight: 500;
    }
    a:hover {
      text-decoration: none;
      color: #f6763a;
      margin: 0 10px;
      font-weight: 500;
    }
    language-selector {
      margin-left: auto;
    }
  `;

  constructor() {
    super();
    // Dil değişikliği için event listener ekleyin
    document.addEventListener("language-changed", () => {
      this.requestUpdate(); // Dil değiştiğinde bileşeni yeniden render et
    });
  }

  render() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentViewMode = urlParams.get("viewMode") || "list"; // viewMode parametresini URL'den al

    return html`
      <nav>
        <div>
          <img src="/ing-logo.png" alt="Logo ING" />
        </div>
        <a
          href="/?page=1&viewMode=${currentViewMode}"
          @click="${this.goToFirstPage}"
        >
          ${t("title")}
        </a>
        <a href="/add?viewMode=${currentViewMode}">${t("addEmployee")}</a>
        <language-selector></language-selector>
      </nav>
    `;
  }

  goToFirstPage(event) {
    event.preventDefault(); // Varsayılan davranışı engeller
    const urlParams = new URLSearchParams(window.location.search);
    const currentViewMode = urlParams.get("viewMode") || "list";

    // Yeni URL oluştur
    const newUrl = `/?page=1&viewMode=${currentViewMode}`;
    window.location.href = newUrl; // Tarayıcıyı yeni URL'ye yönlendir
  }
}

customElements.define("navigation-menu", NavigationMenu);
