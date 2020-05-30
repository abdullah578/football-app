import axios from "axios";
import { timeDiffHour } from "../utils/parseQuery";
import { configuration } from "./api";
let teamCache;
class Team {
  constructor(id) {
    this.id = id;
    teamCache = JSON.parse(localStorage.getItem("teamCache")) || {};
  }
  searchDataCache() {
    if (teamCache[this.id]) {
      const now = new Date();
      if (timeDiffHour(now, new Date(teamCache[this.id].dateCreated)) <= 1) {
        this.chartData = teamCache[this.id].data;
        console.log("T cache hit");
        return true;
      } else return false;
    }
    return false;
  }
  async fetchTeamStatsFromAPI(league_id) {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/statistics/${league_id}/${this.id}`
        )
      );
      const stats = response.data.api.statistics;
      this.chartData = [
        {
          name: "home",
          data: this.parseChartData(stats, "home"),
        },
        {
          name: "away",
          data: this.parseChartData(stats, "away"),
        },
        {
          name: "total",
          data: this.parseChartData(stats, "total"),
        },
      ];
      teamCache[this.id] = {
        data: this.chartData,
        dateCreated: new Date(),
      };
      localStorage.setItem("teamCache", JSON.stringify(teamCache));
    } catch (ex) {
      alert(ex);
    }
  }
  parseChartData(stats, title) {
    const arr = [
      stats.matchs.matchsPlayed[title],
      stats.matchs.wins[title],
      stats.matchs.draws[title],
      stats.matchs.loses[title],
      stats.goals.goalsFor[title],
      stats.goals.goalsAgainst[title],
    ];
    return arr;
  }
}
export default Team;
