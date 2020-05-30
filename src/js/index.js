import * as chart from "./utils/charts";
import { elements, displaySpinner } from "./views/Base";
import League from "./models/League";
import Team from "./models/Team";
import {
  fetchUserInput,
  displayStandings,
  displayFixtures,
} from "./views/leagueView";
import { displayTeamStats } from "./views/teamView";
import { parseQuery, parseInput } from "./utils/parseQuery";
const state = {};
const leagueController = async () => {
  //get input from the input form
  const query = fetchUserInput();
  //parse the input given by the user
  const parsedQuery = parseQuery[parseInput(query)] || {
    name: parseInput(query),
    country: "",
  };
  // Create a league object and store in state
  state.league = new League(parsedQuery.name);
  //check if the input is in the cache and store it in the state
  //if not in cache fetch from API
  if (!state.league.searchLeagueCache()) {
    await state.league.fetchLeagueFromAPI(parsedQuery.country);
    console.log("L cache miss");
  }
  if (!state.league.current_league) return null;
  displaySpinner(elements.fixtureContent, elements.standings);
  if (!state.league.searchDataCache("standing")) {
    await state.league.fetchStandingsFromAPI();
    console.log("S cache miss");
  }

  displayStandings(state.league.current_standings);
  if (!state.league.searchDataCache("fixture")) {
    await state.league.fetchFixturesFromAPI();
    console.log("F cache miss");
  }
  displayFixtures(state.league.current_fixtures);
  console.log(state.league);
};
const teamController = async (id) => {
  state.team = new Team(id);
  if (!state.team.searchDataCache()) {
    await state.team.fetchTeamStatsFromAPI(state.league.current_league.id);
    console.log("T cache miss");
  }
  displayTeamStats(state.team);
};

elements.search.addEventListener("click", leagueController);

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  leagueController();
});
elements.pagination.addEventListener("click", (e) => {
  if (e.target.matches(".pag,.pag *")) {
    console.log(e.target);
    const page = parseInt(e.target.closest(".pag").dataset.to);
    displayFixtures(state.league.current_fixtures, page);
  }
});
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, () => {
    const hash_id = window.location.hash.replace("#", "");
    if (hash_id[0] === "t" && state.league) {
      teamController(hash_id.slice(1));
    }
  });
});
