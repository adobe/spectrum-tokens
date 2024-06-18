#! /usr/bin/env node

/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import tokenDiff from "./index.js";
import chalk from "chalk";
import inquirer from "inquirer";
import fileImport from "./file-import.js";
import * as emoji from "node-emoji";

import { Command } from "commander";

const yellow = chalk.hex("F3EE7E");
const red = chalk.hex("F37E7E");
const green = chalk.hex("7EF383");
const white = chalk.white;

const program = new Command();

program
  .name("tdiff")
  .description("CLI to a Spectrum token diff generator")
  .version("0.0.1");

program
  .command("report")
  .description("Generates a diff report for two inputted schema")
  .option("-y", "answers yes to removing deprecated status of token(s)")
  .option(
    "-otv, --old-token-version <oldVersion>",
    "indicates which npm package version/github tag to pull old tokens from",
    "latest",
  )
  .option(
    "-ntv, --new-token-version <updatedVersion>",
    "indicates which npm package version/github tag to pull new tokens from",
    "latest",
  )
  .option(
    "-otb, --old-token-branch <oldBranch>",
    "indicates which branch to fetch old token data from",
  )
  .option(
    "-ntb, --new-token-branch <newBranch>",
    "indicates which branch to fetch updated token data from",
  )
  .option("-t, --test <file...>", "indicates switch to testing mode")
  .option(
    "-tn, --token-names <name...>",
    "indicates specific tokens to compare",
  )
  .action(async (options) => {
    try {
      const [originalFile, updatedFile] =
        options.test !== undefined
          ? await Promise.all([
              fileImport(options.test[0], "test"),
              fileImport(options.test[1], "test"),
            ])
          : await Promise.all([
              fileImport(
                options.tokenNames,
                options.oldTokenVersion,
                options.oldTokenBranch,
              ),
              fileImport(
                options.tokenNames,
                options.newTokenVersion,
                options.newTokenBranch,
              ),
            ]);
      const result = tokenDiff(originalFile, updatedFile);
      cliCheck(originalFile, result, options);
    } catch (e) {
      console.error(red("\n" + e + "\n"));
    }
  });

program.parse();

/**
 * Formatting helper function for indentation
 * @param {object} text - the string that needs to be indented
 * @param {object} amount - the amount of indents (x3 spaces each indent)
 * @returns {object} indented string
 */
function indent(text, amount) {
  const str = `\n${"   ".repeat(amount)}${text}`;
  return str.replace(/{|}/g, "");
}

/**
 * Styling for renamed tokens
 * @param {object} result - the JSON object with the report results
 * @param {object} token - the current token
 * @param {object} log - the console.log object being used
 */
const printStyleRenamed = (result, token, log) => {
  const str =
    white(`"${result[token]["old-name"]}" -> `) + yellow(`"${token}"`);
  log(indent(str, 1));
};

/**
 * Styling for deprecated tokens
 * @param {object} result - the JSON object with the report results
 * @param {object} token - the current token
 * @param {object} log - the console.log object being used
 */
const printStyleDeprecated = (result, token, log) => {
  log(
    indent(
      yellow(`"${token}"`) +
        white(": ") +
        yellow(`"${result[token]["deprecated_comment"]}"`),
      1,
    ),
  );
};

/**
 * Styling for reverted, added, and deleted tokens
 * @param {object} token - the current token
 * @param {object} color - intended color
 * @param {object} log - the console.log object being used
 */
const printStyleColored = (token, color, log) => {
  log(indent(color(`"${token}"`), 1));
};

/**
 * Styling for updated tokens
 * @param {object} original - the original token(s)
 * @param {object} result - the JSON object with the report results
 * @param {object} renamed - tokens that were renamed
 * @param {object} token - the current token
 * @param {object} log - the console.log object being used
 */
const printStyleUpdated = (original, result, renamed, token, log) => {
  const originalToken =
    original[token] === undefined
      ? original[renamed[token]["old-name"]] // if the token was renamed and updated, need to look in renamed to get token's old name
      : original[token];
  log(indent(yellow(`"${token}"`), 2));
  printNestedChanges(result[token], "", originalToken, originalToken, log);
};

/**
 * Checks for previously deprecated tokens whose deprecated status is removed and asks
 * the user if that is intended
 * @param {object} originalFile - the original token
 * @param {object} result - the updated token report
 * @param {object} options - an array holding the values of options inputted from command line
 */
async function cliCheck(originalFile, result, options) {
  const log = console.log;
  log(
    red(
      "\nWARNING: Will either be inaccurate or will throw an error if used for releases before @adobe/spectrum-tokens@12.26.0!\n",
    ),
  );
  if (Object.keys(result.reverted).length > 0 && !options.y) {
    printSection(
      "\nalarm_clock",
      'Newly "Un-deprecated"',
      Object.keys(result.reverted).length,
      result.reverted,
      log,
      printStyleColored,
      yellow,
    );
    log(
      white(
        "\n-------------------------------------------------------------------------------------------",
      ),
    );
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirmation",
          message:
            "Are you sure this token is supposed to lose its `deprecated` status (y/n)?",
          default: false,
        },
      ])
      .then((response) => {
        if (response.confirmation) {
          console.clear();
          return printReport(originalFile, result, log);
        } else {
          log(
            yellow(
              emoji.emojify(
                "\n:+1: Cool, closing diff generator CLI, see you next time!\n",
              ),
            ),
          );
          return 1;
        }
      });
  } else {
    return printReport(originalFile, result, log, options);
  }
}

/**
 * Formats and prints the report
 * @param {object} original - the original token
 * @param {object} result - the updated token report
 * @param {object} log - console.log object used in previous function (don't really need this, but decided to continue using same variable)
 * @returns {int} exit code
 */
function printReport(original, result, log, options) {
  try {
    const totalTokens =
      Object.keys(result.renamed).length +
      Object.keys(result.deprecated).length +
      Object.keys(result.reverted).length +
      Object.keys(result.added).length +
      Object.keys(result.deleted).length +
      Object.keys(result.updated.added).length +
      Object.keys(result.updated.deleted).length +
      Object.keys(result.updated.updated).length;
    log(white("\n**Tokens Changed (" + totalTokens + ")**"));
    if (
      options.oldTokenBranch !== undefined &&
      options.newTokenBranch !== undefined
    ) {
      log(
        white(`\n${options.oldTokenBranch} | `) +
          yellow(`${options.newTokenBranch}`),
      );
    }
    if (
      options.oldTokenVersion !== undefined &&
      options.newTokenVersion !== undefined
    ) {
      log(
        white(`\n${options.oldTokenVersion} | `) +
          yellow(`${options.newTokenVersion}`),
      );
    }
    log(
      white(
        "-------------------------------------------------------------------------------------------\n",
      ),
    );
    if (Object.keys(result.renamed).length > 0) {
      printSection(
        "memo",
        "Renamed",
        Object.keys(result.renamed).length,
        result.renamed,
        log,
        printStyleRenamed,
      );
    }
    if (Object.keys(result.deprecated).length > 0) {
      printSection(
        "clock3",
        "Newly Deprecated",
        Object.keys(result.deprecated).length,
        result.deprecated,
        log,
        printStyleDeprecated,
      );
    }
    if (Object.keys(result.reverted).length > 0) {
      printSection(
        "alarm_clock",
        'Newly "Un-deprecated"',
        Object.keys(result.reverted).length,
        result.reverted,
        log,
        printStyleColored,
        yellow,
      );
    }
    if (Object.keys(result.added).length > 0) {
      printSection(
        "arrow_up_small",
        "Added",
        Object.keys(result.added).length,
        result.added,
        log,
        printStyleColored,
        green,
      );
    }
    if (Object.keys(result.deleted).length > 0) {
      printSection(
        "arrow_down_small",
        "Deleted",
        Object.keys(result.deleted).length,
        result.deleted,
        log,
        printStyleColored,
        red,
      );
    }
    const totalUpdatedTokens =
      Object.keys(result.updated.added).length +
      Object.keys(result.updated.deleted).length +
      Object.keys(result.updated.updated).length;
    if (totalUpdatedTokens > 0) {
      printTitle("new", "Updated", totalUpdatedTokens, log);
      if (Object.keys(result.updated.added).length > 0) {
        printSection(
          "new",
          "Added Properties",
          Object.keys(result.updated.added).length,
          result.updated.added,
          log,
          printStyleUpdated,
          white,
          result.renamed,
          original,
        );
      }
      if (Object.keys(result.updated.deleted).length > 0) {
        printSection(
          "new",
          "Deleted Properties",
          Object.keys(result.updated.deleted).length,
          result.updated.deleted,
          log,
          printStyleUpdated,
          white,
          result.renamed,
          original,
        );
      }
      if (Object.keys(result.updated.updated).length > 0) {
        printSection(
          "new",
          "Updated Properties",
          Object.keys(result.updated.updated).length,
          result.updated.updated,
          log,
          printStyleUpdated,
          white,
          result.renamed,
          original,
        );
      }
    }
  } catch {
    return console.error(
      red(
        new Error(
          `either could not format and print the result or failed along the way\n`,
        ),
      ),
    );
  }
  return 0;
}

/**
 * Helper function to print and format titles/subtitles
 * @param {string} emojiName - the name of the category's emoji
 * @param {string} title - the category name
 * @param {int} numTokens - the number of tokens changed in that category
 * @param {object} log - the console.log object being used
 * @param {int} amount - the amount of indents
 */
function printTitle(emojiName, title, numTokens, log, amount) {
  log(
    indent(
      white(emoji.emojify(`:${emojiName}: ${title} (${numTokens})`)),
      amount,
    ),
  );
}

/**
 * General helper function for printing each category
 * @param {string} emojiName - the name of the category's emoji
 * @param {string} title - the category name
 * @param {int} numTokens - the number of tokens changed in that category
 * @param {object} result - the json object holding the report
 * @param {object} log - the console.log object being used
 * @param {object} func - the styling function that will be used
 * @param {object} color - the intended text color
 * @param {object} renamed - the renamed tokens
 * @param {object} original - the original token (json object)
 */
function printSection(
  emojiName,
  title,
  numTokens,
  result,
  log,
  func,
  color,
  renamed,
  original,
) {
  const textColor = color || chalk.white;
  if (
    title === "Added Properties" ||
    title === "Deleted Properties" ||
    title === "Updated Properties"
  ) {
    printTitle(emojiName, title, numTokens, log, 1);
  } else {
    printTitle(emojiName, title, numTokens, log, 0);
  }
  Object.keys(result).forEach((token) => {
    if (textColor != white) {
      func(token, textColor, log);
    } else if (original !== undefined && renamed !== undefined) {
      func(original, result, renamed, token, log);
    } else {
      func(result, token, log);
    }
  });
  log("\n");
}

/**
 * Traverse through the updated token's keys and prints a simple changelog
 * @param {object} token - the updated token
 * @param {object} properties - a string containing the keys traversed through until intended value, separated by periods (i.e. sets.light.value)
 * @param {object} originalToken - the original token
 * @param {object} log - the console.log object used
 */
function printNestedChanges(
  token,
  properties,
  originalToken,
  curOriginalLevel,
  log,
) {
  if (
    typeof token !== "object" ||
    typeof token === "string" ||
    token === null
  ) {
    log(indent(yellow(properties.substring(1)), 3));
    if (curOriginalLevel === token) {
      if (
        curOriginalLevel.includes(
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/",
        )
      ) {
        log(indent(yellow(`"${token}"`), 4));
      } else {
        log(indent(yellow(`${token}`), 4));
      }
    } else if (properties.substring(1) === "$schema") {
      const newValue = token.split("/");
      const str =
        indent(white(`"${curOriginalLevel}" -> \n`), 4) +
        indent(
          white(
            `"${token.substring(0, token.length - newValue[newValue.length - 1].length)}`,
          ) +
            yellow(
              `${newValue[newValue.length - 1].split(".")[0]}` +
                white(`.${newValue[newValue.length - 1].split(".")[1]}"`),
            ),
          4,
        );
      log(str);
    } else {
      log(indent(white(`${curOriginalLevel} -> `) + yellow(`${token}`), 4));
    }
    return;
  }
  Object.keys(token).forEach((property) => {
    const nextProperties = properties + "." + property;
    const keys = nextProperties.substring(1).split(".");
    curOriginalLevel = originalToken;
    keys.forEach((key) => {
      curOriginalLevel =
        curOriginalLevel[key] === undefined ? token : curOriginalLevel[key];
    });
    printNestedChanges(
      token[property],
      nextProperties,
      originalToken,
      curOriginalLevel,
      log,
    );
  });
}
