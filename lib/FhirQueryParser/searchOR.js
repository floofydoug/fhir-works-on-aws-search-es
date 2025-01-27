"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const getOrSearchValues = (searchValue) => {
    // split search value string based on commas for OR functionality unless escaped by \
    let unescapedSearchValue = searchValue;
    const splitSearchValue = [];
    let lastIndex = 0;
    for (let c = 0; c < unescapedSearchValue.length; c += 1) {
        if (unescapedSearchValue[c] === '\\') {
            if (c + 1 < unescapedSearchValue.length && unescapedSearchValue[c + 1] === ',') {
                // replace the escape character to allow the string to be handled by ES
                unescapedSearchValue = unescapedSearchValue.substring(0, c) + unescapedSearchValue.substring(c + 1);
            }
        }
        else if (unescapedSearchValue[c] === ',') {
            const subValue = unescapedSearchValue.substring(lastIndex, c);
            // avoid pushing empty strings to array of results
            if (subValue.length > 0) {
                splitSearchValue.push(subValue);
            }
            lastIndex = c + 1;
        }
    }
    const subValue = unescapedSearchValue.substring(lastIndex);
    // avoid pushing empty strings to array of results
    if (subValue.length > 0) {
        splitSearchValue.push(subValue);
    }
    return splitSearchValue;
};
exports.default = getOrSearchValues;
//# sourceMappingURL=searchOR.js.map