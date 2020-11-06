module.exports = {
  modulePathIgnorePatterns: [".next", "node_modules"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.config.jest.js" }],
  },
  moduleNameMapper: {
    "~(.*)$": "<rootDir>/$1",
    "\\.(css)$": "<rootDir>/tests/mocks/styles.ts",
  },
};
