import Fixtures from "./Fixtures";
import axios from "axios";
import { configuration } from "./api";
class LiveFixtures extends Fixtures {
  constructor(id) {
    super(id);
  }
  async fetchlfFromAPI() {
    try {
      const response1 = await axios(
        configuration(`https://v2.api-football.com/fixtures/id/${this.id}`)
      );
      const response2 = await axios(
        configuration(
          `https://v2.api-football.com/statistics/fixture/${this.id}`
        )
      );
      const curr = response1.data.api.fixtures[0];
      this.info = {
        id: curr.fixture_id,
        status: curr.statusShort,
        date: curr.event_date,
        team1: curr.homeTeam.team_name,
        team2: curr.awayTeam.team_name,
        team1_id: curr.homeTeam.team_id,
        team2_id: curr.awayTeam.team_id,
        logo1: curr.homeTeam.logo,
        logo2: curr.awayTeam.logo,
        goals1: curr.goalsHomeTeam,
        goals2: curr.goalsAwayTeam,
        elapsed: curr.elapsed,
      };
      this.league_id = curr.league_id;
      this.stats = response2.data.api.statistics;
      const status = this.info.status;
      this.updateFixturesCache();
      status === "FT" || status === "AET" || status === "PEN"
        ? this.updateffCache()
        : null;
    } catch (ex) {
      alert(ex);
    }
  }
  updateFixturesCache() {
    const fixtures = JSON.parse(localStorage.getItem("fixturesCache"));
    if (!fixtures[this.league_id]) return null;
    const index = fixtures[this.league_id].response.findIndex(
      (curr) => curr.id === parseInt(this.id)
    );
    if (index === -1) return null;
    fixtures[this.league_id].response[index] = this.info;
    localStorage.setItem("fixturesCache", JSON.stringify(fixtures));
  }
  updateffCache() {
    const ff = JSON.parse(localStorage.getItem("ffCache"))||{};
    ff[this.id] = this.stats;
    localStorage.setItem("ffCache", JSON.stringify(ff));
  }
}
export default LiveFixtures;
