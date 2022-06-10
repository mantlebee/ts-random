module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  modulePaths: ["<rootDir>/src"],
  transform: { "^.+\\.ts$": "ts-jest" },
  transformIgnorePatterns: ["!node_modules/"]
};
