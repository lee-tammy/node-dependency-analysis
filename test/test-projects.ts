import {TestProject} from './util';

export const test1 = new TestProject({
    '*': ['a@1', 'c@2', 'd@1'],
    'a@1': ['b@1', 'c@1'],
    'b@1': ['c@1'],
    'c@1': [],
    'c@2': [],
    'd@1': []
});
