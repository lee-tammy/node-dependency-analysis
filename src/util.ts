import pify from 'pify';
import fs from 'fs';

export const filesInDir = pify(fs.readdir);
export const readFile = pify(fs.readFile);
export const fileInfo = pify(fs.stat)