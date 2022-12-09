import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this.renderHtml(markup);
  }

  renderHtml(markup) {
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    //convert markup-string into Dom-Node Object
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll("*"));
    const curElement = Array.from(this._parentElement.querySelectorAll("*"));

    //loop over 2 arrayst at the same time with current i!!
    newElement.forEach((newEl, i) => {
      let curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = ` <div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div> `;

    this.renderHtml(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-alert-triangle"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;

    this.renderHtml(markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
    <svg>
    <use href="${icons}#icon-smile"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;

    this.renderHtml(markup);
  }
}
