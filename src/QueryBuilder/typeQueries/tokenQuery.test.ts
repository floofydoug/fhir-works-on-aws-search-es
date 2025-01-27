/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { tokenQuery } from './tokenQuery';
import { FHIRSearchParametersRegistry } from '../../FHIRSearchParametersRegistry';
import { parseTokenSearchValue } from '../../FhirQueryParser/typeParsers/tokenParser';

const fhirSearchParametersRegistry = new FHIRSearchParametersRegistry('4.0.1');
const identifierParam = fhirSearchParametersRegistry.getSearchParameter('Patient', 'identifier')!.compiled[0];
// const intentParam = { resourceType: 'MedicationRequest', path: 'intent' };

console.log('this is identifierParam', identifierParam);

describe('tokenQuery', () => {
    test('system|code', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('http://acme.org/patient|2345'), true))
            .toMatchInlineSnapshot(`
            Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.system.keyword",
                        "identifier.coding.system.keyword",
                      ],
                      "lenient": true,
                      "query": "http://acme.org/patient",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.code.keyword",
                        "identifier.coding.code.keyword",
                        "identifier.value.keyword",
                        "identifier.keyword",
                        "identifier",
                      ],
                      "lenient": true,
                      "query": "2345",
                    },
                  },
                ],
              },
            }
        `);
    });
    test('system|', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('http://acme.org/patient'), true))
            .toMatchInlineSnapshot(`
            Object {
              "multi_match": Object {
                "fields": Array [
                  "identifier.code.keyword",
                  "identifier.coding.code.keyword",
                  "identifier.value.keyword",
                  "identifier.keyword",
                  "identifier",
                ],
                "lenient": true,
                "query": "http://acme.org/patient",
              },
            }
        `);
    });
    test('|code', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('|2345'), true)).toMatchInlineSnapshot(`
            Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.code.keyword",
                        "identifier.coding.code.keyword",
                        "identifier.value.keyword",
                        "identifier.keyword",
                        "identifier",
                      ],
                      "lenient": true,
                      "query": "2345",
                    },
                  },
                  Object {
                    "bool": Object {
                      "must_not": Object {
                        "exists": Object {
                          "field": "identifier.system",
                        },
                      },
                    },
                  },
                ],
              },
            }
        `);
    });
    test('code', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('http://acme.org/patient|2345'), true))
            .toMatchInlineSnapshot(`
            Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.system.keyword",
                        "identifier.coding.system.keyword",
                      ],
                      "lenient": true,
                      "query": "http://acme.org/patient",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.code.keyword",
                        "identifier.coding.code.keyword",
                        "identifier.value.keyword",
                        "identifier.keyword",
                        "identifier",
                      ],
                      "lenient": true,
                      "query": "2345",
                    },
                  },
                ],
              },
            }
        `);
    });

    test('code; without keyword', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('http://acme.org/patient|2345'), false))
            .toMatchInlineSnapshot(`
            Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.system",
                        "identifier.coding.system",
                      ],
                      "lenient": true,
                      "query": "http://acme.org/patient",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "identifier.code",
                        "identifier.coding.code",
                        "identifier.value",
                        "identifier",
                      ],
                      "lenient": true,
                      "query": "2345",
                    },
                  },
                ],
              },
            }
        `);
    });

    test('boolean', () => {
        expect(tokenQuery(identifierParam, parseTokenSearchValue('true'), true)).toMatchInlineSnapshot(`
            Object {
              "multi_match": Object {
                "fields": Array [
                  "identifier.code.keyword",
                  "identifier.coding.code.keyword",
                  "identifier.value.keyword",
                  "identifier.keyword",
                  "identifier",
                ],
                "lenient": true,
                "query": "true",
              },
            }
        `);
    });
});
