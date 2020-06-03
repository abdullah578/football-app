import axios from "axios";
import { parseDate, timeDiffHour } from "../utils/parseData";
import { configuration } from "./api";

let leagueCache, standingsCache, fixturesCache, scorersCache;
class League {
  constructor(query) {
    this.query = query;

    //fetch caches from localStorage
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

      //if current date is before season end or less than a day has 
      //passed since first league search return true and set data
      if (now <= season_end || timeDiffHour(
        now,
        new Date(leagueCache[this.query].dateCreated),
        "day"
      ) <= 1) {
        this.current_league = leagueCache[this.query];
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

      //sort the response in a descending order of dates
      if (country)
        leagueObj = leagueObj.filter((curr) => curr.country === country);
      leagueObj = leagueObj.sort((a, b) => b.season - a.season);
      const { league_id, season_end, logo, name } = leagueObj[0];
      this.current_league = {
        id: league_id,
        end: season_end,
        dateCreated: new Date(),
        logo,
        name,
      };
      leagueCache[this.query] = this.current_league;
      localStorage.setItem("leagueCache", JSON.stringify(leagueCache));
    } catch (ex) {
      alert("An Error Occured! :(");
    }
  }
  searchDataCache(type) {
    //check if in cache and return true if present and set data
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

    if (cache[this.current_league.id]) {
      const now = new Date();
      if (
        timeDiffHour(
          now,
          new Date(cache[this.current_league.id].dateCreated),
          unit
        ) <= 1
      ) {
        this[objProperty] = cache[this.current_league.id].response;
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
      standingsCache[this.current_league.id] = {
        response: this.current_standings,
        dateCreated: new Date(),
      };
      localStorage.setItem("standingsCache", JSON.stringify(standingsCache));
    } catch (ex) {
      alert("An Error Occurred! :(");
    }
  }
  async fetchFixturesFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/fixtures/league/${this.current_league.id}`
        )
      );
      this.current_fixtures = response.data.api.fixtures.map((curr) => ({
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
      }));
      fixturesCache[this.current_league.id] = {
        response: this.current_fixtures,
        dateCreated: new Date(),
      };
      localStorage.setItem("fixturesCache", JSON.stringify(fixturesCache));
    } catch (ex) {
      alert("An Error Occurred!");
    }
  }
  async fetchScorersFromAPI() {
    try {
      const response = await axios(
        configuration(
          `https://v2.api-football.com/topscorers/${this.current_league.id}`
        )
      );

      //fetch the top 17 players from topscorers list
      this.current_scorers = response.data.api.topscorers
        .map((elem) => ({
          name: elem.player_name,
          position: elem.position,
          goals: elem.goals.total,
          assists: elem.goals.assists,
        }))
        .slice(0, 17);

      scorersCache[this.current_league.id] = {
        response: this.current_scorers,
        dateCreated: new Date(),
      };
      localStorage.setItem("scorersCache", JSON.stringify(scorersCache));
    } catch (ex) {
      alert("An Error Occurred! :(");
    }
  }
}

export default League;
