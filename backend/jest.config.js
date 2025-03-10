export default {
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverage: true,
    coverageReporters: ["lcov", "text"],
    testMatch: ["**/test/**/*.test.js", "**/__tests__/**/*.test.js"]
  };
  