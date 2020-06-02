export const elements = {
  search: document.querySelector(".header-form-btn"),
  form: document.querySelector(".header-form"),
  form_input: document.querySelector(".header-form input "),
  standings: document.querySelector(".content-table"),
  fixtures: document.querySelector(".content-fixtures"),
  pagination: document.querySelector(".fixtures-pag"),
  stats: document.querySelector(".content-stats"),
  fixtureContent: document.querySelector(".fixtures-div"),
  logo: document.querySelector(".header-logo img"),
};

export const displaySpinner = (...elems) => {
  elems.forEach((curr) => {
    curr.innerHTML = `
  <div class="loader">
    <svg class="loader-icon">
      <use href="img/icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;
  });
};
export const highlightSelected = (id, type) => {
  document
    .querySelector(`a[href="#${type}${id}"]`)
    .parentNode.classList.add("team-active");
};
export const clearSelected = (type) => {
  Array.from(document.querySelectorAll(`.highlight-dark-${type}`)).forEach(
    (curr) => {
      curr.classList.remove("team-active");
    }
  );
};
