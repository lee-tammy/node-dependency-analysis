import { TestProject } from "./util";
import test from 'ava';
import pify from 'pify';
import fs from 'fs';
import * as tree from '../src/package-tree';
import {PackageTree} from './util-package-tree';

test('first tester', async t => {

    const test1 = new TestProject({
        '*': ['a@1', 'c@2', 'd@1'],
        'a@1': ['b@1', 'c@1'],
        'b@1': ['c@1'],
        'c@1': [],
        'c@2': [],
        'd@1': []
    })
    const path1: string = await test1.create();
    const root = new PackageTree<null>('a', '1.0.0', null, []);
    const resolvedTree:PackageTree<string> = tree.resolvePaths(root, path1);
    console.log(resolvedTree.name);

    const test = new TestProject({
        '*': ['a@1', 'c@2', 'd@1'],
        'a@1': ['b@1', 'c@1'],
        'b@1': ['c@1'],
        'c@1': [],
        'c@2': [],
        'd@1': []
    })
    const path: string = await test.create();
    const readDirA = await pify(fs.readdir)(path);
    console.log('path to *: ' + readDirA)
    const readDirB = await pify(fs.readdir)(`${path}/node_modules/a`);
    console.log('path to b: ' + readDirB)
    const readDir2 = await pify(fs.readdir)(`${path}/node_modules/a/node_modules/c`);
    console.log(readDir2);
    test.cleanup();
});

