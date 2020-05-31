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

export const parseDate = (date) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};
export const timeDiffHour = (dt1, dt2, units = "hour") => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  if (units === "day") diff /= 24;
  return Math.abs(Math.round(diff));
};
