import { leagueCache } from "../utils/leagueCache";
import axios from "axios";

class League {
  constructor(query) {
    this.query = query;
  }

  searchCache() {
    //check if date in cache
    if (leagueCache[this.query]) {
      //check if the current date is before than the season end and return true
      const now = new Date();
      const season_end = new Date(leagueCache[this.query].end.split("-"));
      if (now <= season_end) {
        this.current_league = leagueCache[this.query];
        return true;
      } else return false;
    } else return false;
  }

  async fetchFromAPI(country) {
    const config = {
      method: "get",
      url: `https://v2.api-football.com/leagues/search/${this.query}`,
      headers: { "X-RapidAPI-Key": "8cbbd5e240931706dc6569e5a6bd597b" },
    };
    try {
      const response = await axios(config);
      let leagueObj = response.data.api.leagues;
      if (country)
        leagueObj = leagueObj.filter((curr) => curr.country === country);
      leagueObj = leagueObj.sort((a, b) => b.season - a.season);
      const { league_id, season_end } = leagueObj[0];
      this.current_league = { id: league_id, end: season_end };
      leagueCache[this.query] = this.current_league;
    } catch (ex) {
      alert("Something went wrong. Please try again");
    }
  }
}

export default League;
