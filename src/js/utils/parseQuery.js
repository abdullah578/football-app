export const parseQuery = {
  la_liga: {
    name: "primera_division",
    country: "Spain",
  },
  primera_division: {
    name: "primera_division",
    country: "Spain",
  },
  bundesliga: {
    name: "bundesliga_1",
    country: "Germany",
  },
  serie_a: {
    name: "serie_a",
    country: "Italy",
  },
  premier_league: {
    name: "premier_league",
    country: "England",
  },
  ligue_1: {
    name: "ligue_1",
    country: "France",
  },
  ligue_one: {
    name: "ligue_1",
    country: "France",
  },
};

export const parseInput = (input) => {
  input = input.toLowerCase();
  input = input.trim().replace(/  +/g, " ").replace(" ", "_");
  return input;
};
