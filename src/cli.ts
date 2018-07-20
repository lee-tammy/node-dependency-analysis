import {SearchValue} from './search';

const temp = 'const b = \'hihttp\';const a = require(\'http\');';
run(temp);

async function run(fileContent: string): Promise<SearchValue> {
  const f = require('./search').search(fileContent);
  return f;
}
