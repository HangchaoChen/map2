const voting_data = {
  Illinois: {
    name: "Illinois",
    demographic: {
      Total: 12741080,
      White: 9135145,
      "Black or African American": 1793079,
      Asian: 717938,
      "Native Hawaiian and Other Pacific Islander": 5317,
      "Two or more races": 340977,
      "American Indian and Alaska Native": 35846,
      "Some Other Race": 712778
    },
    vote_CONGRESSIONAL_2016: {
      democratic: 2810536,
      republican: 2397436,
      others: 33795,
      winner: "Democratic"
    },
    vote_CONGRESSIONAL_2018: {
      democratic: 2757540,
      republican: 1754449,
      others: 27715,
      winner: "Democratic"
    },
    vote_PRESIDENTIAL_2016: {
      republican: 2094175,
      democratic: 2982257,
      others: 459916,
      winner: "Democratic"
    }
  },
  Ohio: {
    name: "Ohio",
    demographic: {
      Total: 11689442,
      White: 9470940,
      "Black or African American": 1446306,
      Asian: 271762,
      "Native Hawaiian and Other Pacific Islander": 4228,
      "Two or more races": 358398,
      "American Indian and Alaska Native": 25672,
      "Some Other Race": 112136
    },
    vote_CONGRESSIONAL_2016: {
      republican: 2996017,
      democratic: 2154523,
      others: 67815,
      winner: "Republican"
    },
    vote_CONGRESSIONAL_2018: {
      republican: 2291333,
      democratic: 2082684,
      others: 32341,
      winner: "Republican"
    },
    vote_PRESIDENTIAL_2016: {
      republican: 2763860,
      democratic: 2370463,
      others: 261318,
      winner: "Republican"
    }
  },
  Oregon: {
    name: "Oregon",
    demographic: {
      Total: 4190713,
      White: 3514983,
      "Black or African American": 82046,
      Asian: 190680,
      "Native Hawaiian and Other Pacific Islander": 18758,
      "Two or more races": 197222,
      "American Indian and Alaska Native": 49051,
      "Some Other Race": 137973
    },
    vote_CONGRESSIONAL_2016: {
      democratic: 1026851,
      republican: 730894,
      others: 154120,
      winner: "Democratic"
    },
    vote_CONGRESSIONAL_2018: {
      democratic: 1061412,
      republican: 702531,
      others: 83703,
      winner: "Democratic"
    },
    vote_PRESIDENTIAL_2016: {
      republican: 431264,
      democratic: 996338,
      others: 229133,
      winner: "Democratic"
    }
  }
};

export class StateInfo {
  message = "test messgae ";
  get_message() {
    return this.message;
  }
  get_voting_data() {
    return voting_data;
  }
}
