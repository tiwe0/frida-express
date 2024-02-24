import * as parser from "@babel/parser"
import { default as traverse } from "@babel/traverse";

export function getRPCExportsFunctions(source: string) {
  let rpcExportsFunctions: string[] = [];
  let ast = parser.parse(source, { sourceType: "script" });
  traverse(ast, {
    AssignmentExpression(path: any) {
      const { node } = path;
      if (
        node.left &&
        node.left.object &&
        node.left.object.type === "Identifier" &&
        node.left.object.name === "rpc" &&
        node.left.property &&
        node.left.property.type === "Identifier" &&
        node.left.property.name === "exports" &&
        node.right &&
        node.right.type === "ObjectExpression"
      ) {
        node.right.properties.forEach((property: any) => {
          if (property.type === "ObjectMethod") {
            rpcExportsFunctions.push(property.key.name);
          }
        });
      }
    },
  });
    return rpcExportsFunctions;
}