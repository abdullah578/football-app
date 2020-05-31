import * as chart from "./utils/charts";
import { elements, displaySpinner } from "./views/Base";
import League from "./models/League";
import Team from "./models/Team";
import {
  fetchUserInput,
  displayStandings,
  displayFixtures,
  displayScorers,
  highlightSelected,
  clearSelected,
} from "./views/leagueView";
import { displayTeamStats, displayPlayers } from "./views/teamView";
import { parseQuery, parseInput } from "./utils/parseQuery";
const state = {};
const leagueController = async () => {
  //get input from the input form
  const query = fetchUserInput(elements.form_input);
  //parse the input given by the user
  const parsedQuery = parseQuery[parseInput(query)] || {
    name: parseInput(query),
    country: "",
  };
  // Create a league object and store in state
  state.league = new League(parsedQuery.name);
  //check if the input is in the cache and store it in the state
  //if not in cache fetch from API
  !state.league.searchLeagueCache()
    ? await state.league.fetchLeagueFromAPI(parsedQuery.country)
    : null;
  if (!state.league.current_league) return null;
  displaySpinner(elements.fixtureContent, elements.standings, elements.stats);
  !state.league.searchDataCache("standings")
    ? await state.league.fetchStandingsFromAPI()
    : null;

  displayStandings(state.league.current_standings);
  !state.league.searchDataCache("fixtures")
    ? await state.league.fetchFixturesFromAPI()
    : null;
  state.dispFixture = state.league.current_fixtures;
  displayFixtures(state.dispFixture);
  !state.league.searchDataCache("scorers")
    ? await state.league.fetchScorersFromAPI()
    : null;
  displayScorers(
    state.league.current_scorers,
    state.league.current_league.logo
  );
  history.replaceState(null, null, " ");
};
const teamController = async (id) => {
  state.team = new Team(id);
  !state.team.searchDataCache("team")
    ? await state.team.fetchTeamStatsFromAPI(state.league.current_league.id)
    : null;
  clearSelected(id);
  highlightSelected(id);
  displayTeamStats(state.team);
  state.dispFixture = state.league.current_fixtures.filter(
    (curr) => curr.team1_id == id || curr.team2_id == id
  );
  displayFixtures(state.dispFixture);
  !state.team.searchDataCache("player")
    ? await state.team.fetchPlayersFromAPI(
        new Date(state.league.current_league.end).getFullYear() - 1
      )
    : null;
  displayPlayers(state.team.playerList);
};

elements.search.addEventListener("click", leagueController);

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  leagueController();
});
elements.pagination.addEventListener("click", (e) => {
  if (e.target.matches(".pag,.pag *")) {
    const page = parseInt(e.target.closest(".pag").dataset.to);
    displayFixtures(state.dispFixture, page);
  }
});
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, () => {
    const hash_id = window.location.hash.replace("#", "");
    if (hash_id[0] === "t") {
      if (state.league) teamController(hash_id.slice(1));
    }
  });
});
elements.fixtures.addEventListener("submit", (e) => {
  e.preventDefault();
  let teamName = fetchUserInput(e.target.firstChild);
  state.dispFixture = state.dispFixture.filter(
    (curr) =>
      parseInput(curr.team1) === parseInput(teamName) ||
      parseInput(curr.team2) === parseInput(teamName)
  );
  displayFixtures(state.dispFixture);
});
