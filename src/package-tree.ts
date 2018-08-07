import fs from 'fs';
import { X_OK } from 'constants';
import { getDynamicEval, getIOModules } from './analysis';

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
  /*let updatedTree: PackageTree;
  // step 1: get POI for current package
  packageTree.dependencies.forEach((pkg) => {
    const poiList = getPackagePOIList(pkg);
    updatedTree = {rootPackageName: packageTree.rootPackageName, version:
  packageTree.version, data: poiList, dependencies: packageTree.dependencies};
  });
  return updatedTree;*/

  // step 2: add POI to PackageTree Object
}

// Should the parameter be a list of jsfiles instead of a packagetree
//parameter = pkg: PackageTree
export function getPackagePOIList(): PointOfInterest[] {
  const packagePOIList: PointOfInterest[] = [];
  // calls getPointsOfInterest for each file in package
  // step 1: Locate the package.json/ module folder file for this package
  // step 2: for each file => 
  //                      get the POI array
  //                      concatenate it with a result array
  const files = getJSFiles('./node_modules/tslint/');
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8').toString();
    const functionArr: Function[] = [getIOModules, getDynamicEval];
    const filePOIList = getPointsOfInterest(content, file, functionArr);
    packagePOIList.push(...filePOIList);
  });
  
  // step 3: return the result array
  return packagePOIList;
}

/*export function findPackageDir(name: string, version: string): string{
  const moduleFolders: string[] = fs.readdirSync('./node_modules/', 'utf8');
  moduleFolders.find((mod) => {

    if(mod === name){

    }
  })
  return '';
}*/

// Gets the path of all js files
export function getJSFiles(dir: string): string[] {
  const topLevelFiles = fs.readdirSync(dir);
  const fileList: string[] = [];
  topLevelFiles.forEach((file) => {
    if (file.endsWith('.js')) {
      fileList.push(`${dir}${file}`);
    } else if (fs.statSync(`${dir}${file}`).isDirectory()) {
      const path = `${dir}${file}/`;
      fileList.push(...getJSFiles(path));
    }
  });
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
