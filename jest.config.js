module.exports = {
  globalSetup: "<rootDir>/jest.global-setup.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/src"],
  transform: { "^.+\.ts$": "ts-jest" },
};
