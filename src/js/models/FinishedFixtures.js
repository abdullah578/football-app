import Fixtures from "./Fixtures";
import { configuration } from "./api";
import axios from "axios";
let ffCache;
class FinishedFixtures extends Fixtures {
  constructor(id) {
    super(id);

    //fetch ffCache from localStorage
    ffCache = JSON.parse(localStorage.getItem("ffCache")) || {};
  }

  //if fixture is found, returns true and set data
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

      //save ffCache to localStorage
      localStorage.setItem("ffCache", JSON.stringify(ffCache));
    } catch (ex) {
      alert("An Error Occured! :(");
    }
  }
}

export default FinishedFixtures;
