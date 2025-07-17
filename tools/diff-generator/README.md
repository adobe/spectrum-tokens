# Token Diff Generator Library and CLI

###### WARNING: Will either be inaccurate or will throw an error if used for releases or branches that use tokens from before @adobe/spectrum-tokens@12.26.0!

The token diff generator library and cli is a npm package containing the CLI and standalone Javascript library that you can use to generate reports detailing the changes made between two different Spectrum token schema. Both the CLI and the standalone Javascript library are located in the Spectrum Tokens monorepo.

## Installation

Installing the package is done preferably with pnpm.

```
pnpm i @adobe/token-diff-generator
```

## Imports

Import the token diff generator as a module per ES6 standards.

```
import tokenDiff from “@adobe/token-diff-generator”;
```

## Token diff generator library

The token diff generator library holds the functions used to generate diffs between two compilations of design tokens. It uses the deep-object-diff open-source library to extract a JSON object containing the changes, and then runs that JSON object through various functions to tailor the result specifically for design tokens.

An example of tailoring involves detecting when tokens are renamed. The deep-object-diff library is unable to tell whether or not a token has been renamed due to it being designed for general JSON objects. Instead, it will mark the new name as a new token being added to the schema and the old name as a deleted token.

This is where the token diff generator comes in. It goes through the changes detected by deep-object-diff and checks if a token is renamed via its uuid. Since the token diff generator relies on all tokens having their own uuid, the library—including the CLI and web version—will not work for versions of spectrum-tokens before the @adobe/spectrum-tokens@12.26.0 release.

### Usage examples

The most basic usage case is calling tokenDiff with two JSON objects, one for the original token(s) and the other for the updated token(s).

```
import tokenDiff from “@adobe/token-diff-generator”;

const report = tokenDiff(originalSchema, updatedSchema);
```

If you are interested in comparing tokens locally between different versions or branches, you can use the following code snippet.

```
import tokenDiff from “@adobe/token-diff-generator”;
import fileImport from “@adobe/token-diff-generator”;

const [originalSchema, updatedSchema] = await Promise.all([
              fileImport(tokenNames, originalVersion, originalBranch),
              fileImport(tokenNames, updatedVersion, updatedBranch),
            ]);

const report = tokenDiff(originalSchema, updatedSchema);
```

Both of these examples output a JSON object containing the changes made between the two schema.

## Token diff cli

The token diff cli is a command line interface tool used to generate reports in the terminal with data from the token diff generator. It is included in the same package as the standalone Javascript library and uses the commander open-source library.

### Commands

There currently is only one command to run in the CLI. It generates a diff report for two inputted schema.

```
tdiff report
```

### Options

| Shorthand | Name                  | Argument(s)    | Description                                                 |
| --------- | --------------------- | -------------- | ----------------------------------------------------------- |
| `--otv`   | `--old-token-version` | `<oldVersion>` | github tag to pull old tokens from                          |
| `--ntv`   | `--new-token-version` | `<newVersion>` | github tag to pull new tokens from                          |
| `--otb`   | `--old-token-branch`  | `<oldBranch>`  | branch to fetch old token data from                         |
| `--ntb`   | `--new-token-branch`  | `<newBranch>`  | branch to fetch new token data from                         |
| `-l`      | `--local`             | `<path>`       | local path within repository to fetch token data from       |
| `-n`      | `--token-names`       | `<tokens...>`  | indicates specific tokens to compare                        |
| `-r`      | `--repo`              | `<repo>`       | git repo to use if you want to use a fork                   |
| `-g`      | `--githubAPIKey`      | `<key>`        | github api key to use when fetching from github             |
| `-f`      | `--format`            | `<format>`     | choose result format cli (default), markdown, or handlebars |
| `-t`      | `--template`          | `<template>`   | template name for handlebars format (default, json, plain)  |
|           | `--template-dir`      | `<dir>`        | custom template directory for handlebars format             |
| `-o`      | `--output`            | `<path>`       | choose where to store result output, if available           |
| `-d`      | `--debug`             | `<path>`       | optional path to store unformatted result output            |

### Usage examples

This is how you can compare between branches and/or versions.

```
tdiff report --otv shirlsli/diff-generator-cli-tests --ntb shirlsli/file-import-tests
```

This is how you can compare specific token files from a remote branch with your local data.

```
tdiff report --otb shirlsli/file-import-tests -l packages/tokens/src -n color-aliases.json color-component.json
```

```
tdiff report --otv "@adobe/spectrum-tokens@13.0.0-beta.46" --ntv "@adobe/spectrum-tokens@13.0.0-beta.47" --format markdown --output logs/output.md
```

This is how you can use the new handlebars formatter with different templates:

```
tdiff report --otv "@adobe/spectrum-tokens@13.0.0-beta.46" --ntv "@adobe/spectrum-tokens@13.0.0-beta.47" --format handlebars --template json --output logs/output.json
```

```
tdiff report --otb main --ntb feature-branch --format handlebars --template plain --output logs/diff.txt
```

### Handlebars Formatter

The handlebars formatter provides flexible templating capabilities for customizing the output format of token diff reports. **As of v2.2.0, all output formats use the unified Handlebars template system with chalk-powered colors for better maintainability, consistency, and terminal compatibility. The legacy CLI formatter has been completely replaced.**

**Built-in Templates:**

- `cli` - Terminal-friendly output with colors (default for CLI format)
- `default` - Markdown-style output similar to the existing markdown formatter
- `json` - Structured JSON output with full diff details
- `plain` - Clean plain text output for CLI consumption
- `summary` - High-level summary with statistics only

**Custom Templates:**
You can create custom templates in the `src/templates/` directory or specify a custom template directory with `--template-dir`.

**Template Features:**

- Full access to diff data through Handlebars helpers
- Built-in helpers for common formatting tasks
- Support for conditional logic and loops
- Easy to extend with custom helpers

**Available Helpers:**

- `totalTokens` - Calculate total number of changed tokens
- `totalUpdatedTokens` - Calculate total number of tokens with property updates
- `hasKeys` - Check if an object has properties
- `cleanPath` - Clean up property paths
- `formatDate` - Format timestamps
- `hilite`, `error`, `passing`, `neutral` - Terminal color helpers powered by chalk
- `bold`, `dim`, `emphasis` - Text formatting helpers using chalk
- `indent` - Helper for proper indentation (3 spaces per level)
- `concat` - Helper to concatenate strings
- `quote` - Helper to wrap text in quotes
