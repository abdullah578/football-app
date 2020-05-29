import axios from "axios";

let leagueCache, standingsCache, fixturesCache;
class League {
  constructor(query) {
    this.query = query;
    leagueCache = JSON.parse(localStorage.getItem("leagueCache")) || {};
    standingsCache = JSON.parse(localStorage.getItem("standingsCache")) || {};
    fixturesCache = JSON.parse(localStorage.getItem("fixturesCache")) || {};
  }

  searchLeagueCache() {
    //check if date in cache
    if (leagueCache[this.query]) {
      //check if the current date is before than the season end and return true
      const now = new Date();
      const season_end = new Date(leagueCache[this.query].end.split("-"));
      if (now <= season_end || now.getDay() === leagueCache[this.query].day) {
        this.current_league = leagueCache[this.query];
        console.log("L cache Hit");
        return true;
      } else return false;
    } else return false;
  }

  async fetchLeagueFromAPI(country) {
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
      this.current_league = {
        id: league_id,
        end: season_end,
        day: new Date().getDay(),
      };
      leagueCache[this.query] = this.current_league;
      localStorage.setItem("leagueCache", JSON.stringify(leagueCache));
    } catch (ex) {
      alert("Something went wrong. Please try again");
    }
  }
  searchDataCache(type) {
    //check if in cache and return true if present
    const cache = type === "standing" ? standingsCache : fixturesCache;
    const objProperty =
      type === "standing" ? "current_standings" : "current_fixtures";
    if (cache[this.query]) {
      const now = new Date();
      if (now.getHours() - cache[this.query].hour === 0) {
        this[objProperty] = cache[this.query].response;
        console.log("S cache hit");
        return true;
      } else return false;
    }
    return false;
  }
  async fetchStandingsFromAPI() {
    const config = {
      method: "get",
      url: `https://v2.api-football.com/leagueTable/${this.current_league.id}`,
      headers: { "X-RapidAPI-Key": "8cbbd5e240931706dc6569e5a6bd597b" },
    };
    try {
      const response = await axios(config);
      this.current_standings = response.data.api.standings[0].map((curr) => ({
        id: curr.team_id,
        logo: curr.logo,
        points: curr.points,
        name: curr.teamName,
      }));
      standingsCache[this.query] = {
        response: this.current_standings,
        hour: new Date().getHours(),
      };
      localStorage.setItem("standingsCache", JSON.stringify(standingsCache));
    } catch (ex) {
      alert(ex);
    }
  }
  async fetchFixturesFromAPI() {
    const config = {
      method: "get",
      url: `https://v2.api-football.com/fixtures/league/${this.current_league.id}`,
      headers: { "X-RapidAPI-Key": "8cbbd5e240931706dc6569e5a6bd597b" },
    };
    try {
      const response = await axios(config);
      this.current_fixtures = response.data.api.fixtures.map((curr) => ({
        id: curr.fixture_id,
        status: curr.status,
        date: curr.event_date,
        team1: curr.homeTeam.team_name,
        team2: curr.awayTeam.team_name,
        goals1: curr.goalsHomeTeam,
        goals2: curr.goalsAwayTeam,
      }));
      fixturesCache[this.query] = {
        response: this.current_fixtures,
        hour: new Date().getHours(),
      };
      localStorage.setItem("fixturesCache", JSON.stringify(fixturesCache));
    } catch (ex) {
      console.log(ex);
    }
  }
}

export default League;
