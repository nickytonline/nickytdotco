// For syntax highlighting only
const html = String.raw;
const darkModeIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const lightModeIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

class ThemeToggle extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'user-color-scheme';
    this.COLOR_MODE_KEY = '--color-mode';
  }

  connectedCallback() {
    this.render();
  }

  getCSSCustomProp(propKey) {
    let response = getComputedStyle(document.documentElement).getPropertyValue(propKey);

    // Tidy up the string if there’s something to work with
    if (response.length) {
      response = response.replace(/\'|"/g, '').trim();
    }

    // Return the string response by default
    return response;
  }

  applySetting(passedSetting) {
    let currentSetting = passedSetting || localStorage.getItem(this.STORAGE_KEY);

    if (currentSetting) {
      document.documentElement.setAttribute('data-user-color-scheme', currentSetting);
      this.setButtonLabelAndStatus(currentSetting);
    } else {
      this.setButtonLabelAndStatus(this.getCSSCustomProp(this.COLOR_MODE_KEY));
    }
  }

  toggleSetting() {
    let currentSetting = localStorage.getItem(this.STORAGE_KEY);

    switch (currentSetting) {
      case null:
        currentSetting =
          this.getCSSCustomProp(this.COLOR_MODE_KEY) === 'dark' ? 'light' : 'dark';
        break;
      case 'light':
        currentSetting = 'dark';
        break;
      case 'dark':
        currentSetting = 'light';
        break;
    }

    localStorage.setItem(this.STORAGE_KEY, currentSetting);

    return currentSetting;
  }

  setButtonLabelAndStatus(currentSetting) {
    this.modeToggleButton.setAttribute(
      'aria-label',
      `${currentSetting === 'dark' ? 'Light' : 'Dark'} theme`
    );
    this.modeToggleButton.innerHTML =
      currentSetting === 'dark' ? lightModeIcon : darkModeIcon;
    this.modeStatusElement.innerText = `Color mode is now "${currentSetting}"`;
  }

  render() {
    this.innerHTML = html`
      <div class="theme-toggle">
        <div role="status" class="[ visually-hidden ][ js-mode-status ]"></div>
        <button class="button js-mode-toggle">${darkModeIcon}</button>
      </div>
    `;

    this.afterRender();
  }

  afterRender() {
    this.modeToggleButton = document.querySelector('.js-mode-toggle');
    this.modeStatusElement = document.querySelector('.js-mode-status');

    this.modeToggleButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      this.applySetting(this.toggleSetting());
    });

    this.applySetting();
  }
}

if ('customElements' in window) {
  customElements.define('theme-toggle', ThemeToggle);
}

export default ThemeToggle;
