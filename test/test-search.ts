import test from 'ava';
import * as search from '../src/search';

test(
    'standard require http case',
    async t => {
      const content = 'const a = require(\'http\');';
      const result = await search.search(content);
      //t.true(result.http === true);
    }
);

test(
    'require callee is defined as a variable',
    async t => {
      const content = 'const r = require;\n something = r(\'http\');';
      const result = await search.search(content);
      //t.true(result.http === true);
    }
);

test(
    'require arg is a concatenation of strings that forms http',
    async t => {
      const content = 'const a = require(\'h\' + \'t\' + \'t\' + \'p\');';
      const result = await search.search(content);
     // t.true(result.http === true);
    }
);

test(
    'require arg is a substring that forms http',
    async t => {
        const content1 = `const a = \'anotherhttp\'\nconst b = require(a.substring(6));`;
        const result1 = await search.search(content1);
        //t.true(result1.http === true);

        const content2 = 'const a = require(\'anotherhttp\'.substring(6))';
        const result2 = await search.search(content2);
        //t.true(result2.http === true);
    }
);

test(
    'require function call not saved in variable',
    async t => {
        const content = 'const a = require(\'h\' + \'t\' + \'t\' + \'p\');';
        const result = await search.search(content);
        //t.true(result.http === true);
    }
);

test(
    'require arg is a function that returns http',
    async t => {
      const content = 'function returnHttp(){return \'http\';}\nconst a = require(returnHttp);';
      const result = await search.search(content);
      //t.true(result.http === true);
    }
);

test(
    'no require call to http',
    async t => {
      const content = 'const a=  require(\'meow\');';
      const result = await search.search(content);
      //t.true(result.http === false);
    }
);

test(
    'string interpolation',
    async t => {
      const content = 'const a = require(\'meow\');';
      const result = await search.search(content);
      //t.true(result.http === false);
    }
);
