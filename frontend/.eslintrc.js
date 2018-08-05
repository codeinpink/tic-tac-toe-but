module.exports = {
  "extends": [
    "standard",
    "plugin:react/recommended"
  ],
  "plugins": ["jest"],
  "env": {
    "jest/globals": true
  },
  "globals": {
    "fetch": false,
    "WebSocket": false
  }
};
