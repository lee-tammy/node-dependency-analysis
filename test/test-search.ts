import test from 'ava';
import * as search from '../src/search';

test('standard require http case', async t => {
  const content = 'const a = require(\'http\');';
  const result = await search.search(content);
  t.true(result.requiredModules.indexOf('http') !== -1);
});

test('no require call to http', async t => {
  const content = 'const a = require(\'meow\');';
  const result = await search.search(content);
  t.true(result.requiredModules.indexOf('http') === -1);
});

test('string interpolation', async t => {
  const content = 'const a = require(`${\'http\'}`);';
  const result = await search.search(content);
  t.true(result.requiredModules.indexOf('http') !== -1);
});

test('multiple require calls', async t => {
  const content =
      'const a = require(\'http\');\n const b = require(`${\'fs\'}`);';
  const result = await search.search(content);
  t.true(result.requiredModules.indexOf('http') !== -1);
  t.true(result.requiredModules.indexOf('fs') !== -1);
});
