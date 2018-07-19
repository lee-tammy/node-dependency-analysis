import * as acorn from 'acorn';
import { Program } from 'estree';
const walk = require('acorn/dist/walk');

export interface SearchValue {
  requiredModules: string[]
}

/**
 * Searches file content for points of interest
 * 
 * @param content contents of a file
 */
export async function search(content: string): Promise<SearchValue> {
    const tree = await acorn.parse(content);
    const nodeArr: acorn.Node[] = getRequireCalls(tree);
    const moduleArr: string[] = getRequiredModules(nodeArr);

    const value = {requiredModules: moduleArr};
    console.log(JSON.stringify(tree, null, 2))
    
    return value;
}

/**
 * Returns a list of acorn nodes that contain 'require' call expressions
 * 
 * @param tree abstract syntax tree 
 */
function getRequireCalls(tree: Program){
    const requireCalls: acorn.Node[] = [];
    walk.simple(tree, {
        CallExpression: (e: any) => {
            if(e.callee.name === 'require'){
                requireCalls.push(e);
            }
        }  
    });
    return requireCalls;
}

/**
 * Returns a list of the modules being required
 * 
 * @param requireNodes array of acorn nodes that contain 'require' call expression
 */
function getRequiredModules(requireNodes: acorn.Node[]): string[]{
    const requiredModules: string[] = [];
    requireNodes.forEach((node: any) => {
        const arg = node.arguments[0];
        if(arg.type === 'Literal'){
            requiredModules.push(arg.value);
        }else{
            console.log('dynamic require call')
        }
    });

    return requiredModules;
}
