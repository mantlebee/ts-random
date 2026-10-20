module.exports = {
  globalSetup: "<rootDir>/jest.global-setup.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  modulePaths: ["<rootDir>/src"],
  roots: ["<rootDir>/src"],
  transform: { "^.+\.ts$": "ts-jest" },
  transformIgnorePatterns: ["!node_modules/"]
};
