# @adobe/token-diff-generator

## 2.2.0

### Minor Changes

- [#540](https://github.com/adobe/spectrum-tokens/pull/540) [`47692c3`](https://github.com/adobe/spectrum-tokens/commit/47692c3d3a1bc388ce02f098aef491277e08779d) Thanks [@GarthDB](https://github.com/GarthDB)! - # Improve code quality and developer experience
  - Remove unused dependencies (`emojilib`, `inquirer`, `tar`, `tmp-promise`) reducing package size
  - Add comprehensive ESLint configuration with enhanced error detection and auto-fixing
  - Replace experimental JSON imports with standard approach to eliminate Node.js warnings
  - Remove legacy `formatterCLI.js` code (401 lines) replaced by Handlebars templates
  - Add development tooling: `ava.config.js`, lint scripts (`pnpm run lint`, `pnpm run lint:fix`)
  - Enhance package.json metadata with better description, keywords, and npm publishing configuration
  - Improve test infrastructure with centralized JSON loading utilities
  - Fix documentation version consistency and test schema issues

  All changes are backward compatible. No migration required.

## 2.1.0

### Minor Changes

- [#530](https://github.com/adobe/spectrum-tokens/pull/530) [`9b891f8`](https://github.com/adobe/spectrum-tokens/commit/9b891f86b0162144f2be614cec55bfa23b6bf041) Thanks [@GarthDB](https://github.com/GarthDB)! - feat(diff-generator): add Handlebars formatter support with templates

  Added comprehensive Handlebars support to the token diff generator:
  - **New Handlebars formatter**: Added `formatterHandlebars.js` with support for custom template rendering
  - **Template system**: Added multiple built-in templates:
    - `default.hbs` - Standard diff output with enhanced formatting
    - `json.hbs` - JSON-formatted output
    - `plain.hbs` - Plain text output
    - `summary.hbs` - Condensed summary format
  - **CLI integration**: Integrated Handlebars formatter into the CLI with template selection options
  - **Test coverage**: Added comprehensive test suite for the new Handlebars functionality
  - **Documentation**: Updated README with usage examples and template documentation

  This enhancement provides greater flexibility in customizing diff output formats while maintaining backward compatibility with existing functionality.

## 2.0.0

### Major Changes

- [`312a3d2`](https://github.com/adobe/spectrum-tokens/commit/312a3d263bb0d72cd40db180a19c4d5282d5649d) Thanks [@GarthDB](https://github.com/GarthDB)! - The latest version of [commander](https://www.npmjs.com/package/commander) requires that each option short flag can only consist of a single character.

  Changes:

  | Old flag | New flag |
  | -------- | -------- |
  | `-otv`   | `--otv`  |
  | `-ntv`   | `--ntv`  |
  | `-otb`   | `--otb`  |
  | `-ntb`   | `--ntb`  |
  | `-tn`    | `-n`     |
  | `-gak`   | `-g`     |

## 1.3.0

### Minor Changes

- [#443](https://github.com/adobe/spectrum-tokens/pull/443) [`b371af5`](https://github.com/adobe/spectrum-tokens/commit/b371af50645fe04ef4aef286b7350e3113a4ff3a) Thanks [@mrcjhicks](https://github.com/mrcjhicks)! - Format and output command line options added.

  ```
  Options:
    -otv, --old-token-version <oldVersion>  indicates which github tag to pull old tokens from
    -ntv, --new-token-version <newVersion>  indicates which github tag to pull new tokens from
    -otb, --old-token-branch <oldBranch>    indicates which branch to fetch old token data from
    -ntb, --new-token-branch <newBranch>    indicates which branch to fetch updated token data from
    -tn, --token-names <tokens...>          indicates specific tokens to compare
    -l, --local <path>                      indicates to compare to local data
    -r, --repo <name>                       github repository to target
    -gak, --githubAPIKey <key>              github api key to use
    -f, --format <format>                   cli (default) or markdown
    -o, --output <path>                     file path to store diff output
    -d, --debug <path>                      file path to store diff json
    -h, --help                              display help for command
  ```

## 1.2.0

### Minor Changes

- [`254ba19`](https://github.com/adobe/spectrum-tokens/commit/254ba1927b78d8c5cefbdb4fe35f3aff162efaee) Thanks [@GarthDB](https://github.com/GarthDB)! - minor fixes to diff tool comparisons

## 1.1.2

### Patch Changes

- [#430](https://github.com/adobe/spectrum-tokens/pull/430) [`fccd972`](https://github.com/adobe/spectrum-tokens/commit/fccd97294e300ff6e755334c3bff83da0caf1247) Thanks [@GarthDB](https://github.com/GarthDB)! - Fix version number in cli using a prepare script in the package.json file

## 1.1.1

### Patch Changes

- [#423](https://github.com/adobe/spectrum-tokens/pull/423) [`9a36be0`](https://github.com/adobe/spectrum-tokens/commit/9a36be01e5c0305dea7d8d9bdbd33c86d9a53399) Thanks [@GarthDB](https://github.com/GarthDB)! - Fixed issue when version number was hardcoded.

## 1.1.0

### Minor Changes

- [#407](https://github.com/adobe/spectrum-tokens/pull/407) [`c186fb8`](https://github.com/adobe/spectrum-tokens/commit/c186fb8e2129bc2f4e40aa00b06984b34cabe63b) Thanks [@GarthDB](https://github.com/GarthDB)! - Replaced --test with --local to make it easier to compare released changes with a local branch'

## 1.0.1

### Patch Changes

- [#394](https://github.com/adobe/spectrum-tokens/pull/394) [`71b38bd`](https://github.com/adobe/spectrum-tokens/commit/71b38bd99262e707ba6333a4d14d1e90ab95d502) Thanks [@GarthDB](https://github.com/GarthDB)! - Fixed author

## 1.0.0

### Major Changes

- [#344](https://github.com/adobe/spectrum-tokens/pull/344) [`8a021e0`](https://github.com/adobe/spectrum-tokens/commit/8a021e0593d5d1bc190bbe6472747135f735791c) Thanks [@shirlsli](https://github.com/shirlsli)! - Initial release of the token diff generator library and cli
