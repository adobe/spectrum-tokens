const { access, readFile, writeFile } = require("fs/promises");
const fetch = require("node-fetch");
const { detailedDiff, diff } = require("deep-object-diff");

const tag = "beta";
const tokenPath = "dist/json/variables.json";

run()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

async function run() {
  const [newTokens, oldTokens] = await Promise.all([
    getNewTokens(),
    getOldTokens(),
  ]);
  const diffResult = detailedDiff(oldTokens, newTokens);
  
  calculatePossibleRenames(diffResult, oldTokens, newTokens);

  logResultCategory(diffResult, 'added');
  logResultCategory(diffResult, 'deleted');
  logResultCategory(diffResult, 'updated', 'Token values updated');
  logResultCategory(diffResult, 'possiblyRenamed', 'Tokens possibly renamed');
}

async function getNewTokens() {
  try {
    await access(tokenPath);
    return JSON.parse(await readFile(tokenPath, { encoding: "utf8" }));
  } catch {
    console.error("cannot access");
  }
}

async function getOldTokens() {
  try {
    const response = await fetch(
      `https://unpkg.com/@adobe/spectrum-tokens@${tag}/${tokenPath}`
    );
    console.log(`Fetched ${response.url}`);
    return await response.json();
  } catch {
    console.error("cannot access");
  }
}

function calculatePossibleRenames(diffResult, oldTokens, newTokens) {
  diffResult.possiblyRenamed = {};
  Object.keys(diffResult.deleted).forEach((deletedTokenName) => {
    const oldTokenValue = oldTokens[deletedTokenName];
    Object.keys(diffResult.added).forEach((addedTokenName, i) => {
      const newTokenValue = newTokens[addedTokenName];
      if (Object.keys(diff(oldTokenValue, newTokenValue)).length === 0) {
        diffResult.possiblyRenamed[deletedTokenName] = addedTokenName;
      }
    });
  });
}

function logResultCategory(diffResult, categoryKey, msg) {
  const results = diffResult[categoryKey];
  const resultCount = Object.keys(results).length;
  if (!msg) {
    msg = `Tokens ${categoryKey}`;
  }
  if (resultCount > 0) {
    console.log(`\n*${msg} (${resultCount}):*`);
    Object.keys(results).sort().forEach((tokenName, i) => {
      console.log(`  - \`${tokenName}\``);
    });
  }
}
