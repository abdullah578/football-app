import Fixtures from "./Fixtures";
import { configuration } from "./api";
import axios from "axios";
let ffCache;
class FinishedFixtures extends Fixtures {
  constructor(id) {
    super(id);
    ffCache = JSON.parse(localStorage.getItem("ffCache")) || {};
  }
  searchffCache() {
    if (ffCache[this.id]) {
      this.ffStats = ffCache[this.id];
      console.log("F cache hit");
      return true;
    } else return false;
  }
  async fetchffFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/statistics/fixture/${this.id}`
        )
      );
      this.ffStats = response.data.api.statistics;
      ffCache[this.id] = this.ffStats;
      localStorage.setItem("ffCache", JSON.stringify(ffCache));
    } catch (ex) {
      alert(ex);
    }
  }
}

export default FinishedFixtures;
