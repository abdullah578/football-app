import axios from "axios";
import { timeDiffHour } from "../utils/parseData";
import { configuration } from "./api";
let teamCache, playerCache;
class Team {
  constructor(id) {
    this.id = id;
    teamCache = JSON.parse(localStorage.getItem("teamCache")) || {};
    playerCache = JSON.parse(localStorage.getItem("playerCache")) || {};
  }
  searchDataCache(type) {
    const cache = type === "team" ? teamCache : playerCache;
    const objProperty = type === "team" ? "chartData" : "playerList";
    const unit = type === "team" ? "hour" : "day";
    if (cache[this.id]) {
      const now = new Date();
      if (timeDiffHour(now, new Date(cache[this.id].dateCreated), unit) <= 1) {
        this[objProperty] = cache[this.id].response;
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
        response: this.chartData,
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
  async fetchPlayersFromAPI(season) {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/players/team/${this.id}/${season}-${
            season + 1
          }`
        )
      );
      console.log(response.data.api.players);
      this.playerList = response.data.api.players
        .map((curr) => ({
          minutes: curr.games.minutes_played,
          appearences: curr.games.appearences,
          name: curr.player_name,
          goals: curr.goals.total,
          assists: curr.goals.assists,
        }))
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 11);
      console.log(name);
      console.log(this.playerList);
      playerCache[this.id] = {
        response: this.playerList,
        dateCreated: new Date(),
      };
      localStorage.setItem("playerCache", JSON.stringify(playerCache));
    } catch (ex) {
      console.log(ex);
    }
  }
}
export default Team;
