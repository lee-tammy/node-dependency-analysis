import {SearchValue} from './search';

run("const http = require('http');");

async function run(file: string): Promise<SearchValue> {
  return require('./search').search(file);
}
