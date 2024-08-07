import { githubAPIKey } from '../github-api-key.js';

export async function fetchBranchTagOptions(type: string) {
  const url =
    type === 'branch'
      ? 'https://api.github.com/repos/adobe/spectrum-tokens/branches'
      : 'https://api.github.com/repos/adobe/spectrum-tokens/releases';
  return await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${githubAPIKey}`,
    },
  }).then(async response => {
    const arr: any[] | PromiseLike<any[]> = [];
    const obj = await response.json();
    Object.values(obj).forEach((value: any) => {
      if (!value.name.includes('token-diff-generator')) {
        arr.push(value.name);
      }
    });
    return arr;
  });
}

export async function fetchSchemaOptions(
  branchOrTagKey: string,
  branchOrTag: string,
) {
  let schemaOptions: string[] = [];
  const source = 'https://raw.githubusercontent.com/adobe/spectrum-tokens/';
  let branchOrTagArr = branchOrTag.split('@');
  const url =
    branchOrTagKey !== 'branch'
      ? source +
        '%40adobe/spectrum-tokens%40' +
        branchOrTagArr[branchOrTagArr.length - 1]
      : source + branchOrTag;
  schemaOptions = await fetchTokens('manifest.json', url);
  schemaOptions.unshift('all');
  return schemaOptions;
}

async function fetchTokens(tokenName: string, url: string) {
  return (await fetch(`${url}/packages/tokens/${tokenName}`)).json();
}

const source = 'https://raw.githubusercontent.com/adobe/spectrum-tokens/';

/**
 * Returns file with given file name as a JSON object (took this from diff.js)
 * @param {string} tokenName - the name of the target file
 * @param {string} version - the intended package version (full name)
 * @returns {object} the target file as a JSON object
 */
export async function fileImport(
  givenTokenNames: string[],
  givenVersion: string | undefined,
  givenLocation: string | undefined,
) {
  const version = givenVersion || 'latest';
  const location = givenLocation || 'main';
  const link =
    version !== 'latest'
      ? source + version.replace('@', '%40')
      : source + location;
  let tokenNames: string[];
  if (givenTokenNames[0] === 'all') {
    tokenNames = await fetchTokens('manifest.json', link);
  } else {
    tokenNames = givenTokenNames;
  }
  const result = {};
  for (let i = 0; i < tokenNames.length; i++) {
    const tokens = await fetchTokens(tokenNames[i], link);
    Object.assign(result, tokens);
  }
  return result;
}
