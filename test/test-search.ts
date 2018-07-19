import test from 'ava';
import * as search from '../src/search';

// standard require case
test(
    'search on file with http request should return a searchValue object with correct fields',
    async t => {
      const content = 'const a = require(\'http\');';
      const result = await search.search(content);
      t.true(result.http === true);
    }
);

// require callee is defined as a variable
test(
    'search on file with http request(require in a var) should return a searchValue object with correct fields',
    async t => {
      const content = 'const r = require;\n something = r(\'http\');';
      const result = await search.search(content);
      t.true(result.http === true);
    }
);

// require arg is a concatenation of strings that forms http 
test(
    'search on file with http request(concatenated http string) should return a searchValue object with correct fields',
    async t => {
      const content = 'const a = require(\'h\' + \'t\' + \'t\' + \'p\');';
      const result = await search.search(content);
      t.true(result.http === true);
    }
);

// require arg is a substring that forms http
test(
    'search on file with http request(concatenated http string) should return a searchValue object with correct fields',
    async t => {
        const content = 'const a = require(\'h\' + \'t\' + \'t\' + \'p\');';
        const result = await search.search(content);
        t.true(result.http === true);
    }
);


test(
    'search on file without http request should return a searchValue object with correct fields',
    async t => {
      const content = 'const a=  require(\'meow\');';
      const result = await search.search(content);
      t.true(result.http === false);
    }
);
