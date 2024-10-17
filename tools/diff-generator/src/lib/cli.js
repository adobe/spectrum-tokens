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
import inquirer from "inquirer";
import fileImport, { loadLocalData } from "./file-import.js";
import * as emoji from "node-emoji";

import { Command } from "commander";
import { writeFileSync } from "fs";

import cliFormatter from "./formatterCLI.js";
import markdownFormatter from "./formatterMarkdown.js";

/* this is updated by the npm prepare script using update-version.js */
const version = "1.2.0";

const program = new Command();

program
  .name("tdiff")
  .description("CLI to a Spectrum token diff generator")
  .version(version);
program
  .command("report")
  .description("Generates a diff report for two inputted schema")
  .option("-y", "answers yes to removing deprecated status of token(s)")
  .option(
    "-otv, --old-token-version <oldVersion>",
    "indicates which npm package version/github tag to pull old tokens from",
  )
  .option(
    "-ntv, --new-token-version <newVersion>",
    "indicates which npm package version/github tag to pull new tokens from",
  )
  .option(
    "-otb, --old-token-branch <oldBranch>",
    "indicates which branch to fetch old token data from",
  )
  .option(
    "-ntb, --new-token-branch <newBranch>",
    "indicates which branch to fetch updated token data from",
  )
  .option(
    "-tn, --token-names <tokens...>",
    "indicates specific tokens to compare",
  )
  .option("-l, --local <path>", "indicates to compare to local data")
  .option("-o, --output <format>", "cli or markdown")
  .action(async (options) => {
    try {
      const [originalFile, updatedFile] = await determineFiles(options);
      const result = tokenDiff(originalFile, updatedFile);
      cliCheck(result, options);
    } catch (e) {
      console.error(cliFormatter.error("\n" + e + "\n"));
    }
  });

async function determineFiles(options) {
  if (options.local && (options.newTokenBranch || options.newTokenVersion)) {
    return await Promise.all([
      loadLocalData(options.local, options.tokenNames),
      fileImport(
        options.tokenNames,
        options.newTokenVersion,
        options.newTokenBranch,
      ),
    ]);
  } else if (
    options.local &&
    (options.oldTokenBranch || options.oldTokenVersion)
  ) {
    return await Promise.all([
      fileImport(
        options.tokenNames,
        options.oldTokenVersion,
        options.oldTokenBranch,
      ),
      loadLocalData(options.local, options.tokenNames),
    ]);
  } else if (options.local) {
    return await Promise.all([
      loadLocalData(options.local, options.tokenNames),
    ]);
  } else {
    return await Promise.all([
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
  }
}

program.parse();

/**
 * Checks for previously deprecated tokens whose deprecated status is removed and asks
 * the user if that is intended
 * @param {object} result - the updated token report
 * @param {object} options - an array holding the values of options inputted from command line
 */
async function cliCheck(result, options) {
  const log = console.log;
  log(
    cliFormatter.error(
      "\nWARNING: Will either be inaccurate or will throw an error if used for releases before @adobe/spectrum-tokens@12.26.0!\n",
    ),
  );
  if (
    Object.keys(result.reverted).length > 0 &&
    !options.y &&
    options.output !== "markdown"
  ) {
    cliFormatter.printSection(
      "alarm_clock",
      'Newly "Un-deprecated"',
      Object.keys(result.reverted).length,
      result.reverted,
      log,
      (...args) => {
        return cliFormatter.printStyleColored(...args);
      },
      (...args) => {
        return cliFormatter.hilite(...args);
      },
    );
    log(
      cliFormatter.neutral(
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
          // console.clear();
          log(
            cliFormatter.neutral(
              "\n-------------------------------------------------------------------------------------------",
            ),
          );
          return printReport(result, log, options);
        } else {
          log(
            cliFormatter.hilite(
              emoji.emojify(
                "\n:+1: Cool, closing diff generator CLI, see you next time!\n",
              ),
            ),
          );
          return 1;
        }
      });
  } else {
    return printReport(result, log, options);
  }
}

function printReport(result, log, options) {
  try {
    let reportOutput = [];
    let reportFormatter;
    let reportFunction;
    switch (options.output) {
      case "markdown":
        reportFormatter = markdownFormatter;
        reportFunction = (input) => {
          reportOutput.push(input.replaceAll("$", "")); // raw $ can break some markdown renderers occasionally
        };
        break;

      default:
        reportFormatter = cliFormatter;
        reportFunction = log;
    }

    reportFunction(new Date().toLocaleString());

    const exit = reportFormatter.printReport(result, reportFunction, options);

    if (reportOutput.length) {
      const output = reportOutput.join("\n").replaceAll("\n\n", "\n");
      writeFileSync("./output.log", output);
    }

    return exit;
  } catch (error) {
    console.log("\n");
    console.log(error);
    console.log("\n");

    return console.error(
      cliFormatter.error(
        new Error(
          `either could not format and print the result or failed along the way\n`,
        ),
      ),
    );
  }
}
