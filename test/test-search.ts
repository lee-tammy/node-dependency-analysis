import {Position} from 'acorn';
import test from 'ava';

import * as search from '../src/search';

test('standard require http case', async t => {
  const content = 'const a = require(\'http\');';
  const result = await search.search(content);
  t.true(result.requiredModules.has('http'));
});

test('no require call to http', async t => {
  const content = 'const a = require(\'meow\');';
  const result = await search.search(content);
  t.false(result.requiredModules.has('http'));
});

test('string interpolation', async t => {
  const content = 'const a = require(`${\'http\'}`);';
  const result = await search.search(content);
  t.true(result.requiredModules.has('http'));
});

test('multiple require calls', async t => {
  const content =
      'const a = require(\'http\');\n const b = require(`${\'fs\'}`);';
  const result = await search.search(content);
  t.true(result.requiredModules.has('http'));
  t.true(result.requiredModules.has('fs'));
});

test('line number is accurate for search', async t => {
  const content =
      'const a = require(\'http\');\n const b = require(`${\'fs\'}`);';
  const result = await search.search(content);

  const httpPosition = (result.requiredModules.get('http'));
  if (httpPosition) {
    t.deepEqual(httpPosition.lineStart, 1);
  }
  const fsPosition = (result.requiredModules.get('fs'));
  if (fsPosition) {
    t.deepEqual(fsPosition.lineStart, 2);
  }
});
