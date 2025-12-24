const rawAttacks = require("../data/attacks");

function fetchAttackFeed() {
  // Simulates fetching from security provider
  return rawAttacks;
}

module.exports = { fetchAttackFeed };