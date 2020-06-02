import League from "./models/League";
import Team from "./models/Team";
import FinishedFixtures from "./models/FinishedFixtures";
import LiveFixtures from "./models/LiveFixtures";
import UpcomingFixtures from "./models/UpcomingFixtures";
import {
  fetchUserInput,
  displayStandings,
  displayFixtures,
  displayScorers,
} from "./views/leagueView";
import { displayTeamStats, displayPlayers } from "./views/teamView";
import { displayf, displayuf } from "./views/fixturesView";
import {
  elements,
  displaySpinner,
  highlightSelected,
  clearSelected,
} from "./views/Base";
import { parseQuery, parseInput, calculateStatus } from "./utils/parseData";
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
  state.current_page = 1;
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
  clearSelected("t");
  highlightSelected(id, "t");
  displayTeamStats(state.team);
  state.dispFixture = state.league.current_fixtures.filter(
    (curr) => curr.team1_id == id || curr.team2_id == id
  );
  state.current_page = 1;
  displayFixtures(state.dispFixture);
  !state.team.searchDataCache("player")
    ? await state.team.fetchPlayersFromAPI(
        new Date(state.league.current_league.end).getFullYear() - 1
      )
    : null;
  displayPlayers(state.team.playerList);
};
const ffController = async (id) => {
  state.ff = new FinishedFixtures(id);
  !state.ff.searchffCache() ? await state.ff.fetchffFromAPI() : null;
  clearSelected("f");
  highlightSelected(id, "f");
  const index = state.league.current_fixtures.findIndex(
    (curr) => curr.id === parseInt(id)
  );
  const {
    goals1,
    goals2,
    logo1,
    logo2,
    status,
    elapsed,
  } = state.league.current_fixtures[index];
  displayf(
    state.ff.ffStats,
    goals1,
    goals2,
    logo1,
    logo2,
    status,
    elapsed,
    false
  );
};
const lfController = async (id) => {
  if (
    !window.location.hash ||
    window.location.hash.replace("#", "").slice(1) !== id
  )
    return null;
  state.lf = new LiveFixtures(id);
  await state.lf.fetchlfFromAPI();
  if (!state.lf.info) return null;
  if (state.league) {
    const index1 = state.league.current_fixtures.findIndex(
      (curr) => curr.id === parseInt(id)
    );
    const index2 = state.dispFixture.findIndex(
      (curr) => curr.id === parseInt(id)
    );
    state.league.current_fixtures[index1] = state.lf.info;
    index2 !== -1 ? (state.dispFixture[index2] = state.lf.info) : null;
    displayFixtures(state.dispFixture, page);
    clearSelected("l");
    highlightSelected(id, "l");
  }
  const { goals1, goals2, logo1, logo2, status, elapsed } = state.lf.info;
  displayf(
    state.lf.stats,
    goals1,
    goals2,
    logo1,
    logo2,
    status,
    elapsed,
    calculateStatus(status) !== "f"
  );
  calculateStatus(status) === "f"
    ? window.location.replace(`#f${id}`)
    : setTimeout(() => {
        lfController(id);
      }, 60000);
};
const ufController = async (id) => {
  state.uf = new UpcomingFixtures(id);
  const index = state.league.current_fixtures.findIndex(
    (curr) => curr.id === parseInt(id)
  );
  const matchDate = new Date(state.league.current_fixtures[index].date);
  const now = new Date();
  if (now >= matchDate) window.location.replace("#l${id}");
  !state.uf.searchufCache() ? await state.uf.fetchufFromAPI() : null;
  console.log(state.uf);
  clearSelected("u");
  highlightSelected(id, "u");
  displayuf(state.uf);
};

elements.search.addEventListener("click", leagueController);

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  leagueController();
});
elements.pagination.addEventListener("click", (e) => {
  if (e.target.matches(".pag,.pag *")) {
    const page = parseInt(e.target.closest(".pag").dataset.to);
    state.current_page = page;
    displayFixtures(state.dispFixture, page);
  }
});
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, () => {
    const hash_id = window.location.hash.replace("#", "");
    const controller = {
      t: teamController,
      f: ffController,
      l: lfController,
      u: ufController,
    };
    controller[hash_id[0]] && (state.league || hash_id[0] === "l")
      ? controller[hash_id[0]](hash_id.slice(1))
      : null;
  });
});
elements.fixtures.addEventListener("submit", (e) => {
  e.preventDefault();
  let teamName = fetchUserInput(e.target.firstChild);
  state.current_page = 1;
  state.dispFixture = state.dispFixture.filter(
    (curr) =>
      parseInput(curr.team1) === parseInput(teamName) ||
      parseInput(curr.team2) === parseInput(teamName)
  );
  state.dispFixture = state.dispFixture.length
    ? state.dispFixture
    : state.league.current_fixtures;
  displayFixtures(state.dispFixture);
});
elements.logo.addEventListener("click", () => {
  if (state.league) {
    state.dispFixture = state.league.current_fixtures;
    state.current_page = 1;
    displayFixtures(state.dispFixture);
  }
});
