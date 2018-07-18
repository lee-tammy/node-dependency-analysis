import test from 'ava';
import * as search from '../src/search';

// standard require
test(
    'search on file with http request should return a searchValue object with correct fields',
    async t => {
      const content = 'const require(\'http\');';
      const result = await search.search(content);
      t.true(result.http === true);
    });

// require in a variable
test(
    'search on file with http request(require in a var) should return a searchValue object with correct fields',
    async t => {
      const content = 'const r = require;\n something = r(\'http\');';
      const result = await search.search(content);
      t.true(result.http === true);
    });

// concatenating http string
test(
    'search on file with http request(concatenated http string) should return a searchValue object with correct fields',
    async t => {
      const content = 'const require(\'htt + p\');';
      const result = await search.search(content);
      t.true(result.http === true);
    });

test(
    'search on file without http request should return a searchValue object with correct fields',
    async t => {
      const content = 'const require(\'meow\');';
      const result = await search.search(content);
      t.true(result.http === false);
    });
