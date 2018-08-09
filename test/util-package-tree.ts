export class PackageTree<T> {
  name = '';
  version = '';
  data: T;
  dependencies: Array<PackageTree<T>> = [];
  constructor(
      name: string, version: string, data: T,
      dependencies: Array<PackageTree<T>>) {
    this.name = name;
    this.version = version;
    this.data = data;
    this.dependencies = dependencies;
  }
}