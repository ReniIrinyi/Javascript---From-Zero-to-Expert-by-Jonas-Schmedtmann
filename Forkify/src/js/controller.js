import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { ModeCommentOutlined, ViewModule } from "@material-ui/icons";
import { async } from "regenerator-runtime";
import paginationView from "./views/paginationView.js";

const controlServings = function (newServings) {
  if (newServings > 0) {
    model.updateServings(newServings);
    recipeView.render(model.state.recipe);
  }
  return;
};

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage());
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlButtonView = function (goToPage) {
  resultView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    controlButtonView();
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  controlButtonView(goToPage);
};

const init = function () {
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerButton(controlPagination);
};
init();

// const html=
// <li class="preview">
// <a class="preview__link" href="#${data.id}">
// <figure class="preview__fig">
// <img src="${data.image}" alt="Test" />
// </figure>
// <div class="preview__data">
// <h4 class="preview__name">
// ${data.title}
// </h4>
// <p class="preview__publisher">${data.publisher}</p>
// </div>
// </a>
// </li>
