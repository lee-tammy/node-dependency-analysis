import { TestProject } from "./util";
import test from 'ava';
import * as tree from '../src/package-tree';
import {PackageTree} from './util-package-tree';

test('first tester', async t => {

    const test = new TestProject({
        '*': ['a@1', 'c@2', 'd@1'],
        'a@1': ['b@1', 'c@1'],
        'b@1': ['c@1'],
        'c@1': [],
        'c@2': [],
        'd@1': []
    })
    const path: string = await test.create();

    const d1 = new PackageTree<null>('d', '1.0.0', null, []);
    const c1 = new PackageTree<null>('c', '1.0.0', null, []);
    const c2 = new PackageTree<null>('c', '1.0.0', null, []);
    const b1 = new PackageTree<null>('b', '1.0.0', null, [c1]);
    const a1 = new PackageTree<null>('a', '1.0.0', null, [b1, b1]);
    const root = new PackageTree<null>('root', '1.0.0', null, [a1, c2, d1]);

    const resolvedTree:PackageTree<string> = tree.resolvePaths(root, path);
    console.log(JSON.stringify(resolvedTree, null, 2));
});

