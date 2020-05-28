import * as chart from "./utils/charts";
import { elements, displaySpinner } from "./views/Base";
import League from "./models/league";
import { leagueCache } from "./utils/leagueCache";
import { fetchUserInput } from "./views/leagueView";
import { parseQuery, parseInput } from "./utils/parseQuery";
const state = {};
const leagueController = async () => {
  //get input from the input form
  const query = fetchUserInput();
  //parse the input given by the user
  const parsedQuery = parseQuery[parseInput(query)] || {
    name: query,
    country: "",
  };
  // Create a league object and store in state
  state.league = new League(parsedQuery.name);
  //display Spinner
  displaySpinner(elements.fixtures, elements.standings);
  //check if the input is in the cache and store it in the state
  //if not in cache fetch from API
  if (!state.league.searchCache()) {
    await state.league.fetchFromAPI(parsedQuery.country);
    console.log("cache miss");
  }
  console.log(state.league);
};

elements.search.addEventListener("click", leagueController);

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  leagueController();
});