import { barChart } from "../utils/charts";
import { elements } from "./Base";

export const displayTeamStats = ({ chartData, id }) => {
  if (!chartData) return null;
  const teamName = document.querySelector(`a[href="#t${id}"] .team-h4`)
    .textContent;
  elements.stats.innerHTML = `
    <figure
    class="highcharts-figure"
    >
    <div id="charts"></div>
    </figure>
  `;
  barChart(teamName, chartData);
};

export const displayPlayers = (playerList) => {
  if (!playerList) return null;
  elements.stats.insertAdjacentHTML(
    "beforeend",
    `
    <h4 class="players">Players</h4>

  <table class="stat-table">
    <tr style="background-color:#2d3844">
      <th>Name</th>
      <th>Appearences</th>
      <th>Goals</th>
      <th>Assists</th>
    </tr>
  </table>
  
  `
  );
  let playerString = "";
  playerList.forEach((curr) => {
    const { name, appearences, goals, assists } = curr;
    playerString += ` <tr>
    <td class="first-col">${name}</td>
    <td class="second-col">${appearences}</td>
    <td class="third-col">${goals}</td>
    <td class="fourth-col">${assists}</td>
  </tr>`;
  });
  document
    .querySelector(".stat-table")
    .insertAdjacentHTML("beforeend", playerString);
};
