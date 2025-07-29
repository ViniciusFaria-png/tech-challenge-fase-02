const path = require("path");
const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "dist/",
        "build/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
        "src/__tests__/**",
        "coverage/**",
      ],
      thresholds: {
        global: {
          branches: 20,
          functions: 20,
          lines: 20,
          statements: 20,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
});
