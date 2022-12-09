import View from "./View.js";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerButton(handler) {
    //Event-delegation => add EventListener to parent-element
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const gotToPage = +btn.dataset.goto;
      handler(gotToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPage
    );
    const currPage = this._data.page;
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    }

    if (currPage === numPages && numPages > 1) {
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span> Page ${currPage - 1}</span>
      </button>
      `;
    }
    if (currPage < numPages) {
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
      </button>
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    }
    return "";
  }
}
export default new paginationView();
