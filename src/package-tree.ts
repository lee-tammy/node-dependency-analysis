import fs from 'fs';

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
    updatedTree = {rootPackageName: packageTree.rootPackageName, version: packageTree.version, 
        data: poiList, dependencies: packageTree.dependencies};
  });
  return updatedTree;*/
  
  // step 2: add POI to PackageTree Object
}

//Should the parameter be a list of jsfiles instead of a packagetree
function getPackagePOIList(pkg: PackageTree): PointOfInterest[] {
  // TODO:
  // calls getPointsOfInterest for each file in package
  // step 1: Locate the package.json/ module folder file for this package
  // step 2: for each file{
    // get the POI array
    // concatenate it with a result array
  // return the result
  throw new Error('not implemented');
  
}

// Gets the path of all js files 
export function getJSFiles(dir: string): string[]{
  const topLevelFiles = fs.readdirSync(dir);
  const fileList: string[] = [];
  topLevelFiles.forEach((file) => {
    if(file.endsWith('.js') || file.endsWith('.ts')){
      fileList.push(`${dir}${file}`);
      console.log(file)
    }else if(fs.statSync(`${dir}/${file}`).isDirectory()){
      const path = `${dir}${file}`;
      //console.log(path)
      fileList.push(`${getJSFiles(path)}`);
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
