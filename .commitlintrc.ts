import type { UserConfig } from "@commitlint/types";
import { readdirSync } from "fs";
import { join } from "path";

const packages = readdirSync(join(__dirname, "packages"));
const apps = readdirSync(join(__dirname, "apps"));

const commitlintConfig: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  helpUrl:
    "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Changes that do not affect the meaning of the code (white-space, formatting, etc.)
        "refactor", // Code changes that neither fix a bug nor add a feature
        "perf", // Performance improvement
        "test", // Adding missing tests or correcting existing tests
        "build", // Changes that affect the build system or external dependencies (example scopes: npm)
        "ci", // Changes to CI configuration files and scripts
        "cd", // Changes to CD configuration files and scripts
        "chore", // Other changes that don't modify src or test files
        "revert" // Reverts a previous commit
      ]
    ],
    "scope-enum": [
      2,
      "always",
      [
        "setup", // Project setup
        "config", // Configuration files
        "dependabot", // Dependabot configuration
        "deps", // Dependency updates
        "deps-dev", // Development dependency updates
        "feature", // Feature-specific changes
        "bug", // Bug fixes
        "docs", // Documentation
        "style", // Code style/formatting
        "refactor", // Code refactoring
        "test", // Tests
        "build", // Build scripts or configuration
        "ci", // Continuous integration
        "cd", // Continuous deployment
        "release", // Release related changes
        "bounty", // Bounty CI related changes
        "thank-you", // Thank you CI related changes
        "other", // Other changes
        "packages", // packages directory,
        ...packages, // all packages
        "memory", // memory provider
        "model", // model provider
        "plugin", // plugin provider
        "apps", // apps directory
        ...apps, // all apps
        "nx", // nx related changes
        "docker" // docker related changes
      ]
    ],
    "header-max-length": [0],
    "subject-max-length": [0],
    "body-max-length": [0],
    "body-max-line-length": [0],
    "footer-max-length": [0],
    "footer-max-line-length": [0]
  }
};

export default commitlintConfig;
