import { barChart } from "../utils/charts";
import { elements } from "./Base";
export const displayTeamStats = ({ chartData, id }) => {
  if (!chartData) return null;
  const teamName = document.querySelector(`a[href="#t${id}"] .team-h4`)
    .textContent;
  elements.stats.innerHTML = `
    <figure
    class="highcharts-figure"
    style="width: 400px; height: 400px;"
    >
    <div id="charts"></div>
    </figure>
  `;
  barChart(teamName, chartData);
};
