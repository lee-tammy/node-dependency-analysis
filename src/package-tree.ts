import {getDynamicEval, getIOModules} from './analysis';
import {fileInfo, filesInDir, readFile} from './util';

export interface PointOfInterest {
  type: string;
  fileName: string;
  position: Position;
}

export interface Position {
  lineStart: number;
  lineEnd: number;
  colStart: number;
  colEnd: number;
}

export interface PackageTree<T> {
  name: string;
  version: string;
  data: T;
  dependencies: Array<PackageTree<T>>;
}

function generatePackageTree(pjson: string): PackageTree<PointOfInterest[]> {
  // todo -- this function will probably be recursive
  // TODO: ADD const packageTreeWithPath = resolvePaths(packageTree, 'hi');
  throw new Error('not implemented');
  // compute result
  //   let result: PackageTree;
  //   return result;
}

// TODO: REVIEW
// create tests
async function getPOIForPackageTree(packageTree: PackageTree<string>):
    Promise<PackageTree<PointOfInterest[]>> {
  // Get package trees with POI arrays in data field
  const dependenciesWithPOI: Array<PackageTree<PointOfInterest[]>> = [];
  await Promise.all(packageTree.dependencies.map(async (pkg) => {
    const dependencyPOIList: PackageTree<PointOfInterest[]> =
        await getPOIForPackageTree(pkg);
    dependenciesWithPOI.push(dependencyPOIList);
  }));

  // Get the POI list for this current package
  const poiList: PointOfInterest[] = await getPackagePOIList(packageTree.data);

  // Create new tree using POI list as data and new list of package trees as
  // dependencies
  const tree: PackageTree<PointOfInterest[]> = {
    name: packageTree.name,
    version: packageTree.version,
    data: poiList,
    dependencies: dependenciesWithPOI
  };
  return tree;
}

export async function getPackagePOIList(path: string):
    Promise<PointOfInterest[]> {
  const packagePOIList: PointOfInterest[] = [];
  const files = await getJSFiles(path);

  await Promise.all(files.map(async (file) => {
    const content = await readFile(file, 'utf8');
    const functionArr: Function[] = [getIOModules, getDynamicEval];
    const filePOIList = getPointsOfInterest(content, file, functionArr);
    packagePOIList.push(...filePOIList);
  }));

  return packagePOIList;
}

function resolvePaths(
    rootNode: PackageTree<null>, rootPath: string): PackageTree<string> {
  // assign root node's path to rootPath
  // for each of the root node's dependencies, call resolvePaths recursive
  // function
  const resolvedNodes: Array<PackageTree<string>> = [];
  rootNode.dependencies.forEach((child) => {
    resolvedNodes.push(resolvePathsRec(child, rootPath));
  });

  const updatedRoot: PackageTree<string> = {
    name: rootNode.name,
    version: rootNode.version,
    data: rootPath,
    dependencies: resolvedNodes
  };

  return updatedRoot;
}

function resolvePathsRec(
    packageNode: PackageTree<null>, parentPath: string): PackageTree<string> {
  const paths: string[] = [];
  const resolvedNodes: Array<PackageTree<string>> = [];
  paths.push(parentPath);
  const path = require.resolve(packageNode.name, {paths});

  packageNode.dependencies.forEach((child) => {
    resolvedNodes.push(resolvePathsRec(child, parentPath));
  });

  const updatedNode: PackageTree<string> = {
    name: packageNode.name,
    version: packageNode.version,
    data: path,
    dependencies: resolvedNodes
  };
  return updatedNode;
}

/**
 * Gets all the javascript files in a package's directory
 *
 * @param path the package's directory path
 */
export async function getJSFiles(path: string): Promise<string[]> {
  const topLevelFiles: string[] = await filesInDir(path, 'utf8');
  const fileList: string[] = [];

  await Promise.all(topLevelFiles.map(async (file) => {
    const currFile = `${path}${file}`;
    if (file.endsWith('.js')) {
      fileList.push(currFile);
    } else if (
        (await fileInfo(currFile)).isDirectory() && file !== 'node_modules') {
      const subArr = await getJSFiles(`${currFile}/`);
      fileList.push(...subArr);
    }
  }));
  return fileList;
}

// Gets Points of Interest for a single file
function getPointsOfInterest(
    contents: string, fileName: string,
    functionArray: Function[]): PointOfInterest[] {
  const pointsOfInterest: PointOfInterest[] = [];
  functionArray.forEach((f) => {
    const subList = f(contents, fileName);
    pointsOfInterest.push(subList);
  });
  return pointsOfInterest;
}

function main() {
  // TODO:
  // const myPackageTree = getDependencies(require('./package.json'));
  // const myIOAnnotatedPackageTree = getIOModules(myPackageTree);
  // print(myIOAnnotatedPackageTree);
  throw new Error('not implemented');
}
