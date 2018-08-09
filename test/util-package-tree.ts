export class PackageTree<T> {
    public name: string = '';
    public version: string = '';
    public data: T;
    public dependencies: PackageTree<T>[] = [];
    constructor(name: string, version: string, data: T, dependencies: PackageTree<T>[]){
        this.name = name;
        this.version = version;
        this.data = data;
        this.dependencies;
    }
}