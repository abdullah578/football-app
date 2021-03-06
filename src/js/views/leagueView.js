import { elements } from "./Base";
import { calculateStatus } from "../utils/parseData";

export const fetchUserInput = (elem) => {
  return elem.value;
};

//display the table entry for one team's standing
const displayStanding = ({ id, logo, name, points }, length) => {
  const html = `
  <li class="team highlight-dark-t" style="${length <= 10 ? "flex:0" : ""}">
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

//display all team standings
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
    displayStanding(curr, standingArr.length);
  });
};

//display one fixture in the table
const displayFixture = (
  { id, status, date, team1, team2, goals1, goals2, elapsed },
  length
) => {
  let matchStatus = calculateStatus(status);
  const html = `
  <li class="content-fixtures-list-element highlight-dark-${matchStatus}"  style="${
    length <= 10 ? "flex:0" : ""
  }">
      <a href="#${matchStatus}${id}" class="fixture-teams">
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
        <p class="fixture-timing" style="${
          matchStatus === "l" ? "color:#e67e22" : ""
        }">${matchStatus === "l" ? `${elapsed} '` : parseDate(date)}</p>
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

//render buttons based on page (to support pagination)
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

//display all fixtures in the table
export const displayFixtures = (
  fixturesArr,
  currentPage = 1,
  numPerPage = 16
) => {
  if (!fixturesArr) {
    elements.fixtureContent.innerHTML = "";
    return null;
  }

  fixturesArr = [...fixturesArr].reverse();

  elements.fixtureContent.innerHTML = `
  <div class="content-fixtures-heading">
    <h4>Fixtures</h4>
    <div class="fixture-forms">
      <form><input type="text" placeholder="Team..." /></form>
    </div>
  </div>
  <ul class="content-fixtures-list">
  </ul>`;

  const start = (currentPage - 1) * numPerPage;
  const end = start + numPerPage;
  fixturesArr.slice(start, end).forEach((curr) => {
    displayFixture(curr, fixturesArr.length);
  });
  renderButtons(currentPage, numPerPage, fixturesArr.length);
  if (fixturesArr.length < numPerPage) elements.pagination.innerHTML = "";
};
export const displayScorers = (scorersArr, logo) => {
  if (!scorersArr) {
    elements.stats.innerHTML = "";
    return null;
  }
  elements.stats.innerHTML = `
      <figure class="league-logo" style="height: 70px;">
        <img
          src="${logo}"
          alt="league-logo"
        />
      </figure>
      <h4 class="players">Top Players</h4>
      <table class="scorers-table">
        <tr style="background-color:#2d3844">
          <th>Name</th>
          <th>Position</th>
          <th>Goals</th>
          <th>Assists</th>
        </tr>
      </table>
  `;
  let playerString = "";
  scorersArr.forEach((curr) => {
    const { name, position, goals, assists } = curr;
    playerString += `
    <tr>
      <td class="first-col">${name}</td>
      <td class="second-col">${position}</td>
      <td class="third-col">${goals ? goals : "&nbsp;"}</td>
      <td class="fourth-col">${assists ? assists : "&nbsp;"}</td>
    </tr>`;
  });
  document
    .querySelector(".scorers-table")
    .insertAdjacentHTML("beforeend", playerString);
};
