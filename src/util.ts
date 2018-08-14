import fs from 'fs';
import pify from 'pify';

export const readdir = pify(fs.readdir);
export const readFile = pify(fs.readFile);
export const stat = pify(fs.stat);
