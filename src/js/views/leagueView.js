import { elements } from "./Base";

export const fetchUserInput = () => {
  return elements.form_input.value;
};

const displayStanding = ({ id, logo, name, points }) => {
  const html = `
  <li class="team">
    <a href="#t${id}" class="current-standings-link">
      <figure class="team-fig">
        <img
          src="${logo}"
          alt="foot-logo"
        />
      </figure>
      <h4 class="team-h4">${name}</h4>
      <p class="team-p">${points}</p>
    </a>
  </li>`;
  document
    .querySelector(".current-standings")
    .insertAdjacentHTML("beforeend", html);
};

export const displayStandings = (standingArr) => {
  if (!standingArr) {
    elements.standings.innerHTML = "";
    return null;
  }
  elements.standings.innerHTML = `
  <h4 class="content-table-heading">Current Standings</h4>
    <ul class="current-standings">
    </ul>

  `;
  standingArr.forEach((curr) => {
    displayStanding(curr);
  });
};

const displayFixture = ({ id, status, date, team1, team2, goals1, goals2 }) => {
  const html = `
  <li>
      <a href="#${
        status === "Match Finished" ? "ff" : "uf"
      }${id}" class="fixture-teams">
        <div class="teams-1-2">
          <div class="team-1">
            <h4 class="fixture-team-h4">${team1}</h4>
            <p class="fixture-team-p" style="color: ${
              goals1 > goals2 ? "#65dd9b" : "#f65164"
            };">${goals1 !== null ? goals1 : "&nbsp;"}</p>
          </div>
          <div class="team-2">
            <h4 class="fixture-team-h4">${team2}</h4>
            <p class="fixture-team-p" style="color: ${
              goals2 > goals1 ? "#65dd9b" : "#f65164"
            };">${goals2 !== null ? goals2 : "&nbsp;"}</p>
          </div>
        </div>
        <p class="fixture-timing">${parseDate(date)}</p>
      </a>
  </li>
  
  `;
  document
    .querySelector(".content-fixtures-list")
    .insertAdjacentHTML("beforeend", html);
};
const parseDate = (dateTime) => {
  const fixture_date = new Date(dateTime);
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${fixture_date.getDate()} ${months[fixture_date.getMonth()]} <br> ${
    fixture_date.toTimeString().split("G")[0]
  }`;
};
export const renderButtons = (currentPage, numPerPage, numItems) => {
  const numPages = Math.ceil(numItems / numPerPage);
  let HTML;
  if (currentPage === 1) {
    HTML = `
    <button class="pag-next pag" data-to=${currentPage + 1}>
      <span>Page ${currentPage + 1}</span>
      <svg class="icon">
        <use href="img/icons.svg#icon-triangle-right"></use>
      </svg>
    </button>
  `;
  } else if (currentPage === numPages) {
    HTML = `
    <button class="pag-prev pag" data-to=${currentPage - 1}>
      <svg class="icon">
        <use href="img/icons.svg#icon-triangle-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>  
    `;
  } else {
    HTML = `
    <button class="pag-prev pag" data-to=${currentPage - 1}>
      <svg class="icon">
        <use href="img/icons.svg#icon-triangle-left" data-to=${
          currentPage - 1
        }></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
     <button class="pag-next pag" data-to=${currentPage + 1}>
      <span>Page ${currentPage + 1}</span>
      <svg class="icon">
        <use href="img/icons.svg#icon-triangle-right"></use>
      </svg>
     </button>
    `;
  }
  elements.pagination.innerHTML = HTML;
};

export const displayFixtures = (
  fixturesArr,
  currentPage = 1,
  numPerPage = 16
) => {
  if (!fixturesArr) {
    elements.fixtureContent.innerHTML = "";
    return null;
  }
  fixturesArr=fixturesArr.reverse();

  elements.fixtureContent.innerHTML = `
  <div class="content-fixtures-heading">
    <h4>Fixtures</h4>
    <form><input type="date" /></form>
  </div>
  <ul class="content-fixtures-list">
  </ul>`;

  const start = (currentPage - 1) * numPerPage;
  const end = start + numPerPage;
  console.log(fixturesArr);
  fixturesArr.slice(start, end).forEach((curr) => {
    displayFixture(curr);
  });
  renderButtons(currentPage, numPerPage, fixturesArr.length);
};
