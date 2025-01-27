"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumber = void 0;
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const NUMBER_REGEX = /^(?<sign>[+-])?(?<whole>\d+)(\.(?<decimals>\d+))?([eE](?<exp>[+-]?\d+))?$/;
// eslint-disable-next-line import/prefer-default-export
const parseNumber = (numberString) => {
    const match = numberString.match(NUMBER_REGEX);
    if (match === null) {
        throw new fhir_works_on_aws_interface_1.InvalidSearchParameterError(`Invalid number in search parameter: ${numberString}`);
    }
    const { decimals = '', exp } = match.groups;
    let significantFiguresDeltaExp = 0;
    // FHIR considers ALL written digits to be significant figures
    // e.g. 100 has 3 significant figures (this is contrary to the more common definition where trailing zeroes are NOT significant figures)
    // See: https://www.hl7.org/fhir/search.html#number
    if (exp !== undefined) {
        significantFiguresDeltaExp = Number(exp) - (decimals.length + 1);
    }
    else {
        significantFiguresDeltaExp = -(decimals.length + 1);
    }
    const numberValue = Number(numberString);
    return {
        number: numberValue,
        implicitRange: {
            start: numberValue - 5 * 10 ** significantFiguresDeltaExp,
            end: numberValue + 5 * 10 ** significantFiguresDeltaExp,
        },
    };
};
exports.parseNumber = parseNumber;
//# sourceMappingURL=number.js.map