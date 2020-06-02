import Fixtures from "./Fixtures";
import axios from "axios";
import { configuration } from "./api";
let ufCache;
class UpcomingFixtures extends Fixtures {
  constructor(id) {
    super(id);
    ufCache = JSON.parse(localStorage.getItem("ufCache")) || {};
  }
  searchufCache() {return false;}
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
          charData: this.chartData,
        },
        dateCreated: new Date(),
      };
      ufCache[this.id] = cacheData;
      localStorage.setItem("ufCache", JSON.stringify(ufCache));
    } catch (ex) {
      alert(ex);
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
