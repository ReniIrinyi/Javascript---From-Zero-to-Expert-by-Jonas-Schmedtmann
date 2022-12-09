class SearchView {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this.clearInput(query);
    return query;
  }

  clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      //if submit =>first preventdefault => on parentElement
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
