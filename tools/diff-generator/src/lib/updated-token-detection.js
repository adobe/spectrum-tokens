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
import { detailedDiff } from "deep-object-diff";

/**
 * Detects updates made to tokens
 * @param {object} renamed - a list containing tokens that were renamed
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @returns {object} updatedTokens - a JSON object containing the updated tokens (with new name, if renamed)
 */
export default function detectUpdatedTokens(renamed, original, changes) {
  const updatedTokens = { ...changes.updated };
  Object.keys(changes.added).forEach((token) => {
    if (renamed[token] !== undefined) {
      const renamedTokenDiff = detailedDiff(
        original[renamed[token]["old-name"]],
        changes.added[token],
      ).updated;
      if (Object.keys(renamedTokenDiff).length !== 0) {
        updatedTokens[token] = renamedTokenDiff;
      }
    }
  });
  return updatedTokens;
}
