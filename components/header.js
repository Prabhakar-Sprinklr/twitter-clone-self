class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <header>
          <h1>
            Twitter Header
          </h1>
        </header>
      `;
    }
  }
  
  customElements.define('header-component', Header);