import { getDynamicEval, getIOModules } from './analysis';
import {filesInDir, fileInfo, readFile} from './util'

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

function getPOIforPackageTree(packageTree: PackageTree): PackageTree {
  throw new Error('not implemented');
  // step 1: get POI for current package
  // step 2: add POI to PackageTree Object
}

// Should the parameter be a list of jsfiles instead of a packagetree
//parameter = pkg: PackageTree
export async function getPackagePOIList(pkg: PackageTree): Promise<PointOfInterest[]> {
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

function findPackagePath(name: string, version: string): string{
  throw new Error('not implemented');
}

export async function getJSFiles(path: string): Promise<string[]> {
  const topLevelFiles: string[] = await filesInDir(path, 'utf8');
  const fileList: string[] = [];

  await Promise.all(topLevelFiles.map(async (file) => {
    if (file.endsWith('.js')) {
      fileList.push(`${path}${file}`);
    } else if ((await fileInfo(`${path}${file}`)).isDirectory() && file !== 'node_modules') {
      const path2 = `${path}${file}/`;
      const subArr = await getJSFiles(path2);
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
