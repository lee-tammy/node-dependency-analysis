import * as acorn from 'acorn';
import {CallExpression, Literal, Node, Program, SimpleLiteral, TemplateLiteral} from 'estree';

const walk = require('acorn/dist/walk');

export interface SearchValue {
  requiredModules: string[];
}

/**
 * Searches file content for points of interest
 *
 * @param content contents of a file
 */
export async function search(content: string): Promise<SearchValue> {
  const tree = await acorn.parse(content);
  const nodeArr: Node[] = getRequireCalls(tree);
  const moduleArr: string[] = getRequiredModules(nodeArr);
  const value = {requiredModules: moduleArr};

  return value;
}

/**
 * Returns a list of acorn nodes that contain 'require' call expressions
 *
 * @param tree abstract syntax tree
 */
function getRequireCalls(tree: Program) {
  const requireCalls: Node[] = [];
  walk.simple(tree, {
    CallExpression(e: CallExpression) {
      if (e.callee.type === 'Identifier' && e.callee.name === 'require') {
        requireCalls.push(e.arguments[0]);
      }
    }
  });
  return requireCalls;
}

/**
 * Returns a list of the modules being required
 *
 * @param requireNodes array of acorn nodes that contain 'require' call
 * expression
 */
function getRequiredModules(requireNodes: Node[]): string[] {
  const requiredModules: string[] = [];
  requireNodes.forEach((node: Node) => {
    if (node.type === 'Literal' && node.value !== null &&
        node.value !== undefined) {
      requiredModules.push(node.value.toString());
    } else if (node.type === 'TemplateLiteral') {
      const e = node.expressions[0];
      if (e.type === 'Literal' && e.value !== null && e.value !== undefined) {
        requiredModules.push(e.value.toString());
      }
    }
  });
  return requiredModules;
}
