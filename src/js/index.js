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

//runs when user searches for a league
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

  //display loading image while data is fetched
  displaySpinner(elements.fixtureContent, elements.standings, elements.stats);

  //check if standings are in cache, else fetch from api
  !state.league.searchDataCache("standings")
    ? await state.league.fetchStandingsFromAPI()
    : null;

  //display standings
  displayStandings(state.league.current_standings);

  //check if fixtures are in cache, else fetch from api
  !state.league.searchDataCache("fixtures")
    ? await state.league.fetchFixturesFromAPI()
    : null;

  state.dispFixture = state.league.current_fixtures;
  state.current_page = 1; //set current page to 1 (for pagination)

  //display fixtures
  displayFixtures(state.dispFixture);

  //check if scorers are in cache, else fetch from api
  !state.league.searchDataCache("scorers")
    ? await state.league.fetchScorersFromAPI()
    : null;

  //display the scorers on the middle of page
  displayScorers(
    state.league.current_scorers,
    state.league.current_league.logo
  );
  history.replaceState(null, null, " "); //clear hash in url
};

//runs when the user clicks on a team
const teamController = async (id) => {
  state.team = new Team(id);

  //check if team data is in the cache, else fetch team stats from api
  !state.team.searchDataCache("team")
    ? await state.team.fetchTeamStatsFromAPI(state.league.current_league.id)
    : null;

  clearSelected("t"); //allows for clicked
  highlightSelected(id, "t"); //team to remain highlighted

  //displays the team stats
  displayTeamStats(state.team);

  //filters fixtures to only display the selected team's fixtures
  state.dispFixture = state.league.current_fixtures.filter(
    (curr) => curr.team1_id == id || curr.team2_id == id
  );
  state.current_page = 1;

  //displays the fixtures on the right
  displayFixtures(state.dispFixture);

  //search for top rated players in cache, if not found fetch from api
  !state.team.searchDataCache("player")
    ? await state.team.fetchPlayersFromAPI(
        new Date(state.league.current_league.end).getFullYear() - 1
      )
    : null;

  //display the player list in a table
  displayPlayers(state.team.playerList);
};

//runs when the user clicks on a finished fixture (ff)
const ffController = async (id) => {
  state.ff = new FinishedFixtures(id);

  //search for finished fixture details in cache, if not found fetch from api
  !state.ff.searchffCache() ? await state.ff.fetchffFromAPI() : null;

  clearSelected("f"); //allows for selected fixture
  highlightSelected(id, "f"); //to remain highlighted

  //search for clicked fixture in the fixtures array
  const index = state.league.current_fixtures.findIndex(
    (curr) => curr.id === parseInt(id)
  );

  //used to display fixtures
  const {
    goals1,
    goals2,
    team1,
    team2,
    logo1,
    logo2,
    status,
    elapsed,
  } = state.league.current_fixtures[index];
  displayf(
    state.ff.ffStats,
    team1,
    team2,
    goals1,
    goals2,
    logo1,
    logo2,
    status,
    elapsed,
    false
  );
};

//runs when the user clicks on a live fixture
const lfController = async (id) => {
  //check if the hash remains the same
  if (
    !window.location.hash ||
    window.location.hash.replace("#", "").slice(1) !== id
  )
    return null;
  state.lf = new LiveFixtures(id);

  //fetch live fixture data from api
  await state.lf.fetchlfFromAPI();
  if (!state.lf.info) return null;
  if (state.league) {
    //update the fixtures array (current_fixtures)
    const index1 = state.league.current_fixtures.findIndex(
      (curr) => curr.id === parseInt(id)
    );
    const index2 = state.dispFixture.findIndex(
      (curr) => curr.id === parseInt(id)
    );
    state.league.current_fixtures[index1] = state.lf.info;
    index2 !== -1 ? (state.dispFixture[index2] = state.lf.info) : null;

    //display the modified fixtures array
    displayFixtures(state.dispFixture, state.current_page);


    //highlight the live fixture
    clearSelected("l");
    highlightSelected(id, "l");
  }

  //display live fixture stats
  const {
    goals1,
    goals2,
    team1,
    team2,
    logo1,
    logo2,
    status,
    elapsed,
  } = state.lf.info;
  displayf(
    state.lf.stats,
    team1,
    team2,
    goals1,
    goals2,
    logo1,
    logo2,
    status,
    elapsed,
    calculateStatus(status) !== "f"
  );

  //if fixture is finished, change hash
  //else call the function after one minute
  calculateStatus(status) === "f"
    ? window.location.replace(`#f${id}`)
    : setTimeout(() => {
        lfController(id);
      }, 60000);
};

//runs  when the user clicks on an upcoming fixture
const ufController = async (id) => {
  state.uf = new UpcomingFixtures(id);

  //fetch the date of the fixture, if current date l
  //ater than the event date change hash to live
  const index = state.league.current_fixtures.findIndex(
    (curr) => curr.id === parseInt(id)
  );
  const matchDate = new Date(state.league.current_fixtures[index].date);
  const now = new Date();
  if (now >= matchDate) window.location.replace("#l${id}");

  //check predictions in cache, if not found fetch from api
  !state.uf.searchufCache() ? await state.uf.fetchufFromAPI() : null;

  //highlight selected fixture
  clearSelected("u");
  highlightSelected(id, "u");

  //display upcoming fixture page
  displayuf(state.uf);
};

/*

    Event Handlers

*/

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

//runs when user searches for a team in the fixtures column
elements.fixtures.addEventListener("submit", (e) => {
  e.preventDefault(); //prevent page reload
  let teamName = fetchUserInput(e.target.firstChild);
  state.current_page = 1;

  //fetch all the fixtures for the searched teamName
  state.dispFixture = state.dispFixture.filter(
    (curr) =>
      parseInput(curr.team1) === parseInput(teamName) ||
      parseInput(curr.team2) === parseInput(teamName)
  );

  //if the user searches for an invalid team, display all the fixtures
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
