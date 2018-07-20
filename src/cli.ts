import {SearchValue} from './search';

run('const b = \'hihttp\';const a = require(`${\'http\'}`);');


async function run(file: string): Promise<SearchValue> {
  const f = require('./search').search(file);
  f.then(console.log);
  return f;
}
