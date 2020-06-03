import Fixtures from "./Fixtures";
import axios from "axios";
import { configuration } from "./api";
import { timeDiffHour } from "../utils/parseData";
let ufCache;
class UpcomingFixtures extends Fixtures {
  constructor(id) {
    super(id);
    ufCache = JSON.parse(localStorage.getItem("ufCache")) || {};
  }
  searchufCache() {
    if (ufCache[this.id]) {
      const now = new Date();
      if (
        timeDiffHour(now, new Date(ufCache[this.id].dateCreated), "day") <= 1
      ) {
        Object.keys(ufCache[this.id].data).forEach(
          (elem) => (this[elem] = ufCache[this.id].data[elem])
        );
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async fetchufFromAPI() {
    try {
      const response = await axios(
        configuration(`https://v2.api-football.com/predictions/${this.id}`)
      );
      const predData = response.data.api.predictions[0];
      this.chartData = {
        team1: {
          name: predData.teams.home.team_name,
          data: this.fillData(predData, "home"),
        },
        team2: {
          name: predData.teams.away.team_name,
          data: this.fillData(predData, "away"),
        },
      };
      this.stats = predData.comparison;
      this.stats.winningPercent = predData.winning_percent;
      this.winner = predData.advice;
      const cacheData = {
        data: {
          stats: this.stats,
          winner: this.winner,
          chartData: this.chartData,
        },
        dateCreated: new Date(),
      };
      ufCache[this.id] = cacheData;
      localStorage.setItem("ufCache", JSON.stringify(ufCache));
    } catch (ex) {
      alert("An Error Occurred! :(");
    }
  }
  fillData(predData, type) {
    return [
      predData.teams[type].all_last_matches.matchs.wins.total,
      predData.teams[type].all_last_matches.matchs.draws.total,
      predData.teams[type].all_last_matches.matchs.loses.total,
      predData.teams[type].all_last_matches.goals.goalsFor.total,
      predData.teams[type].all_last_matches.goals.goalsAgainst.total,
      parseFloat(predData.teams[type].all_last_matches.goalsAvg.goalsFor.total),
    ];
  }
}
export default UpcomingFixtures;
