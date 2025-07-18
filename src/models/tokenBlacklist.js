const blacklist = [];
const dayjs = require('dayjs');

function addToken(token, exp) {
  blacklist.push({ token, exp });
}

function isBlacklisted(token) {
  // Remove tokens expirados
  const now = dayjs().unix();
  for (let i = blacklist.length - 1; i >= 0; i--) {
    if (blacklist[i].exp < now) {
      blacklist.splice(i, 1);
    }
  }
  return blacklist.some(entry => entry.token === token);
}

module.exports = { addToken, isBlacklisted }; 