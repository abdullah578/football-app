import axios from "axios";
import { parseDate, timeDiffHour } from "../utils/parseQuery";
import { configuration } from "./api";

let leagueCache, standingsCache, fixturesCache, scorersCache;
class League {
  constructor(query) {
    this.query = query;
    leagueCache = JSON.parse(localStorage.getItem("leagueCache")) || {};
    standingsCache = JSON.parse(localStorage.getItem("standingsCache")) || {};
    fixturesCache = JSON.parse(localStorage.getItem("fixturesCache")) || {};
    scorersCache = JSON.parse(localStorage.getItem("scorersCache")) || {};
  }

  searchLeagueCache() {
    //check if date in cache
    if (leagueCache[this.query]) {
      //check if the current date is before than the season end and return true
      const now = new Date();
      const season_end = new Date(leagueCache[this.query].end.split("-"));
      console.log(leagueCache[this.query]);
      if (now <= season_end || now.getDay() === leagueCache[this.query].day) {
        this.current_league = leagueCache[this.query];
        console.log("L cache Hit");
        return true;
      } else return false;
    } else return false;
  }

  async fetchLeagueFromAPI(country) {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/leagues/search/${this.query}`
        )
      );
      let leagueObj = response.data.api.leagues;
      if (country)
        leagueObj = leagueObj.filter((curr) => curr.country === country);
      leagueObj = leagueObj.sort((a, b) => b.season - a.season);
      const { league_id, season_end, logo, name } = leagueObj[0];
      this.current_league = {
        id: league_id,
        end: season_end,
        day: new Date().getDay(),
        logo,
        name,
      };
      leagueCache[this.query] = this.current_league;
      localStorage.setItem("leagueCache", JSON.stringify(leagueCache));
    } catch (ex) {
      alert(ex);
    }
  }
  searchDataCache(type) {
    //check if in cache and return true if present
    const cacheObj = {
      standings: {
        cacheType: standingsCache,
        unit: "hour",
      },
      fixtures: {
        cacheType: fixturesCache,
        unit: "hour",
      },
      scorers: {
        cacheType: scorersCache,
        unit: "day",
      },
    };
    const cache = cacheObj[type].cacheType;
    const objProperty = `current_${type}`;
    const unit = cacheObj[type].unit;

    if (cache[this.query]) {
      const now = new Date();
      if (
        timeDiffHour(now, new Date(cache[this.query].dateCreated), unit) <= 1
      ) {
        this[objProperty] = cache[this.query].response;
        console.log("S cache hit");
        return true;
      } else return false;
    }
    return false;
  }
  async fetchStandingsFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/leagueTable/${this.current_league.id}`
        )
      );
      this.current_standings = response.data.api.standings[0].map((curr) => ({
        id: curr.team_id,
        logo: curr.logo,
        points: curr.points,
        name: curr.teamName,
      }));
      standingsCache[this.query] = {
        response: this.current_standings,
        dateCreated: new Date(),
      };
      localStorage.setItem("standingsCache", JSON.stringify(standingsCache));
    } catch (ex) {
      alert(ex);
    }
  }
  async fetchFixturesFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/fixtures/league/${this.current_league.id}`
        )
      );
      console.log(response.data.api);
      this.current_fixtures = response.data.api.fixtures.map((curr) => ({
        id: curr.fixture_id,
        status: curr.status,
        status_short: curr.statusShort,
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
      }));
      fixturesCache[this.query] = {
        response: this.current_fixtures,
        dateCreated: new Date(),
      };
      localStorage.setItem("fixturesCache", JSON.stringify(fixturesCache));
    } catch (ex) {
      console.log(ex);
    }
  }
  async fetchScorersFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/topscorers/${this.current_league.id}`
        )
      );
      this.current_scorers = response.data.api.topscorers
        .map((elem) => ({
          name: elem.player_name,
          position: elem.position,
          goals: elem.goals.total,
          assists: elem.goals.assists,
        }))
        .slice(0, 17);

      scorersCache[this.query] = {
        response: this.current_scorers,
        dateCreated: new Date(),
      };
      localStorage.setItem("scorersCache", JSON.stringify(scorersCache));
    } catch (ex) {
      alert(ex);
    }
  }
}

export default League;
