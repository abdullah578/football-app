export const elements = {
  search: document.querySelector(".header-form-btn"),
  form: document.querySelector(".header-form"),
  form_input: document.querySelector(".header-form input "),
  standings: document.querySelector(".content-table"),
  fixtures: document.querySelector(".content-fixtures"),
  pagination: document.querySelector(".fixtures-pag"),
  stats: document.querySelector(".content-stats"),
  fixtureContent: document.querySelector(".fixtures-div"),
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
