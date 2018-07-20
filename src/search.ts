import * as acorn from 'acorn';
import {CallExpression, Node, Program} from 'estree';

const walk = require('acorn/dist/walk');

/**
 * requiredModules: A map of module names and the position where they were
 * required in a file dynamicEvals: An array of the locations where require is
 * called dynamically
 */
export interface SearchValue {
  requiredModules: Map<string, Position>;
  dynamicEvals: Position[];
}

/**
 * location of where require is called dynamically
 * TODO: remove columns?!??!? --- is it needed?
 */
export interface Position {
  lineStart: number;
  lineEnd: number;
  colStart: number;
  colEnd: number;
}

/**
 * Searches file content for points of interest
 *
 * @param content contents of a file
 */
export async function search(content: string): Promise<SearchValue> {
  const tree = await acorn.parse(content, {locations: true});
  const nodeArr: Node[] = getRequireCalls(tree);
  const result: SearchValue = getRequiredModules(nodeArr);

  return result;
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
 * Iterates through require nodes and returns a constructed SearchValue object
 *
 * @param requireNodes array of acorn nodes that contain 'require' call
 * expression
 */
function getRequiredModules(requireNodes: Node[]): SearchValue {
  const requiredModules = new Map<string, Position>();
  const dynamicEvalPos: Position[] = [];
  requireNodes.forEach((node: Node) => {
    const pos: Position = {lineStart: 0, lineEnd: 0, colStart: 0, colEnd: 0};
    if (node.loc !== undefined && node.loc !== null) {
      pos.lineStart = node.loc.start.line, pos.lineEnd = node.loc.end.line,
      pos.colStart = node.loc.start.column, pos.colEnd = node.loc.end.column;
    }

    if (node.type === 'Literal' && node.value !== null &&
        node.value !== undefined) {
      requiredModules.set(node.value.toString(), pos);
    } else if (node.type === 'TemplateLiteral') {
      const e = node.expressions[0];
      if (e.type === 'Literal' && e.value !== null && e.value !== undefined) {
        requiredModules.set(e.value.toString(), pos);
      }

      // Require call with dynamic evaluation
    } else {
      dynamicEvalPos.push(pos);
    }
  });

  return {requiredModules, dynamicEvals: dynamicEvalPos};
}
