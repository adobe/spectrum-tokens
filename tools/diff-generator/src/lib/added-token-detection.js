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

/**
 * Check if the added token's uuid exists in renamed and added
 * @param {object} renamed - the token data that were renamed
 * @param {object} changes - the changed token data
 * @returns {object} addedTokens - a JSON object containing the added tokens
 */
export default function detectNewTokens(
  renamed,
  deprecatedTokens,
  changesOriginal,
) {
  const changes = { ...changesOriginal };
  const addedTokens = changes;
  if (renamed.length > 0) {
    Object.keys(changes).forEach((token) => {
      renamed.forEach((item) => {
        if (item["newname"] == token) {
          delete addedTokens[token];
        }
      });
      Object.keys(deprecatedTokens.deprecated).forEach((dep) => {
        if (dep === token) {
          delete addedTokens[token];
        }
      });
    });
  }

  return addedTokens;
}
