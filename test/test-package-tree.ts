import test from 'ava';

import * as tests from './test-projects'
import * as tree from '../src/package-tree';

import {PackageTree} from './util-package-tree';

test('the data property of the package tree should changed from null ' + 
    'to an array of Points of Interest', async t => {
    const path: string = await tests.test1.create();

    const d1 = new PackageTree<null>('d', '1.0.0', null, []);
    const c1 = new PackageTree<null>('c', '1.0.0', null, []);
    const c2 = new PackageTree<null>('c', '2.0.0', null, []);
    const b1 = new PackageTree<null>('b', '1.0.0', null, [c1]);
    const a1 = new PackageTree<null>('a', '1.0.0', null, [b1, c1]);
    const root = new PackageTree<null>('root', '1.0.0', null, [a1, c2, d1]);
  
    console.log('before: ' + JSON.stringify(root, null, 2));
    const resolvedTree: PackageTree<string> = await tree.resolvePaths(root, path);
    console.log('after: ' + JSON.stringify(resolvedTree, null, 2));
  
    tests.test1.cleanup();
    t.pass();
});
