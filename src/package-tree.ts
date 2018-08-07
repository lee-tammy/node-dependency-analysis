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

export interface PackageTree {
  rootPackageName: string;
  version: string;
  data: PointOfInterest[];
  dependencies: PackageTree[];
}

function generatePackageTree(pjson: string): PackageTree {
  // todo -- this function will probably be recursive
  throw new Error('not implemented');
  // compute result
  //   let result: PackageTree;
  //   return result;
}

async function getPOIForPackageTree(packageTree: PackageTree):
    Promise<PackageTree> {
  // throw new Error('not implemented');
  // step 1: get POI for current package
  const packagePOIList = await getPackagePOIList(packageTree);
  // step 2: add POI to PackageTree Object
  const tree = {
    rootPackageName: packageTree.rootPackageName,
    version: packageTree.version,
    data: packagePOIList,
    dependencies: packageTree.dependencies
  };
  return tree;
}

export async function getPackagePOIList(pkg: PackageTree):
    Promise<PointOfInterest[]> {
  const packagePOIList: PointOfInterest[] = [];
  // calls getPointsOfInterest for each file in package
  // step 1: Locate the package.json/ module folder file for this package
  const path = findPackagePath(pkg.rootPackageName, pkg.version);
  // step 2: for each file =>
  //                      get the POI array
  //                      concatenate it with a result array
  const files = await getJSFiles(path);

  await Promise.all(files.map(async (file) => {
    const content = await readFile(file, 'utf8');
    const functionArr: Function[] = [getIOModules, getDynamicEval];
    const filePOIList = getPointsOfInterest(content, file, functionArr);
    packagePOIList.push(...filePOIList);
  }));

  // step 3: return the result array
  return packagePOIList;
}

function findPackagePath(packageName: string, parentPath: string): string {
  throw new Error('not implemented');
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
