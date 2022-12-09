import View from "./View.js";
import icons from "url:../../img/icons.svg";

class resultView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again ;-) ";
  _message = "";

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    console.log(this._data);
    return this._data
      .map((data) => {
        return ` 
        <li class="preview">
            <a class="preview__link ${
              data.id === id ? "preview__link--active" : ""
            }" href="#${data.id}">
              <figure class="preview__fig">
                <img src="${data.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${data.title}</h4>
                <p class="preview__publisher">${data.publisher}</p>
                
              </div>
            </a>
          </li> `;
      })
      .join();
  }
}

export default new resultView();

// preview__link--active

// <div class="preview__user-generated">
//                   <svg>
//                     <use href="${icons}#icon-user"></use>
//                   </svg>
//                 </div>

{
  /* <div class="recipe__user-generated">
                      <svg>
                        <use href="${icons}#icon-user"></use>
                      </svg>
                    </div> */
}
