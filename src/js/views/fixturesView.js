import { elements } from "./Base";
import { radarChart } from "../utils/charts";

//display finished fixtures or live fixtures
export const displayf = (
  ffObj,
  team1,
  team2,
  goals1,
  goals2,
  logo1,
  logo2,
  status_short,
  elapsed,
  isLive
) => {
  elements.stats.innerHTML = `
    <div class="team-scores">
    <div>
    <img
      src="${logo1}"
      alt="foot-logo"
    />
    <p class="team-score-name">${team1}</p>
    </div>
    <div>
    <p class="score-p">${goals1}-${goals2}</p>
    <p class="match-status" style=${isLive ? "color:#e67e22" : ""}>${
    isLive ? elapsed : status_short
  }</p>
    </div>
    <div>
    <img
      src="${logo2}"
      alt="foot-logo"
    />
    <p class="team-score-name">${team2}</p>
    </div>
  </div>   
    `;
  if (!ffObj) return null;
  elements.stats.insertAdjacentHTML(
    "beforeend",
    `
   <h4 class="stats-title">Match Statistics</h4>
   <div class="team-fixture-stats">
        <ul class="fixture-stats-list">
        </ul>
    </div>
   
   `
  );
  displayStats(ffObj);
};
const calcPercentage = (p1, p2) => {
  if (p1 || p2) return (p1 / (p1 + p2)) * 100;
  else return 50;
};

//display upcoming fixtures
export const displayuf = ({ chartData, stats, winner }) => {
  if (!chartData || !stats) return null;
  elements.stats.innerHTML = `
  <figure
    class="highcharts-figure"
  >
    <div id="charts"></div>
  </figure>
  `;
  radarChart(chartData);
  elements.stats.insertAdjacentHTML(
    "beforeend",
    `
  <div class="predicted-stats">
  <div class="prediction-team-names">
    <h4>${chartData.team1.name}</h4>
    <h4>${chartData.team2.name}</h4>
  </div>
  <div class="team-fixture-stats">
   <ul class="fixture-stats-list">
   </ul>
   <div class="winner">
    <p>${winner}</p>
   </div>
  </div>
  `
  );
  displayStats(stats);
};

//display fixture stats
const displayStats = (ffObj) => {
  const mapTitle = {
    forme: "Form",
    att: "Attack",
    def: "Defence",
    fish_law: "Poisson Distribution",
    h2h: "Head to Head",
    goals_h2h: "H2H Goals",
    winningPercent: "Win Percentage",
  };
  Object.keys(ffObj).forEach((title) => {
    if (ffObj[title].home === null || ffObj[title].away === null) return;
    const p1 = calcPercentage(
      parseInt(ffObj[title].home),
      parseInt(ffObj[title].away)
    );
    const p2 = 100 - p1;
    document.querySelector(".fixture-stats-list").insertAdjacentHTML(
      "beforeend",
      ` 
      <li class="fixture-stats-item">
      <h6>${mapTitle[title] || title}</h6>
      <div class="fixture-stats-representaion">
        <p>${ffObj[title].home}</p>
        <div class="team-1-representation">
          <div
            class="line-stat-1"
            style="border-bottom: 1px solid ${
              p1 > p2 ? "#65dd9b" : "#f65164"
            }; width: ${p1}%;"
          ></div>
        </div>
        <div class="team-2-representation">
          <div
            class="line-stat-2"
            style="border-bottom: 1px solid ${
              p2 > p1 ? "#65dd9b" : "#f65164"
            }; width: ${p2}%;"
          ></div>
        </div>
        <p>${ffObj[title].away}</p>
      </div>
    </li>
      `
    );
  });
};
