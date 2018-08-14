import {PackageTree, PointOfInterest} from './package-tree';

// File to output to user

export function outputToUser(packageTree: PackageTree<PointOfInterest[]>) {
  console.log(JSON.stringify(packageTree, null, 2));
}
