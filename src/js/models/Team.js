import axios from "axios";
import { parseDate, timeDiffHour } from "../utils/parseQuery";
let teamCache;
class Team {
  constructor(id) {
    this.id = id;
    teamCache = JSON.parse(localStorage.getItem("teamCache")) || {};
  }
  searchDataCache() {
    if (teamCache[this.id]) {
      const now = new Date();
      if (timeDiffHour(now, new Date(teamCache[this.id].dateCreated))) {
        this.chartData = teamCache[this.id].data;
        return true;
      } else return false;
    }
    return false;
  }
  async fetchTeamStatsFromAPI(league_id) {
    const config = {
      method: "get",
      url: `https://v2.api-football.com/statistics/${league_id}/${this.id}`,
      headers: { "X-RapidAPI-Key": "8cbbd5e240931706dc6569e5a6bd597b" },
    };
    try {
      const response = await axios(config);
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
