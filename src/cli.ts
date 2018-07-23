import {SearchValue, search} from './search';

const temp = 'const b = \'hihttp\';const a = require(\'http\'); const c = require; c(\'http\');'
run(temp);

async function run(fileContent: string): Promise<SearchValue> {
  const f = search(fileContent);
  return f;
}
