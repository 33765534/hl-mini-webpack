import fs from "fs";
import path from "path";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "@babel/core";

let id = 0;
function createAsset(filePath) {
  // 获取文件的内容

  // readFileSync 读取文件内容
  const sourceCode = fs.readFileSync(filePath, "utf-8");
  console.log(sourceCode);

  // 获取依赖关系
  const ast = parser.parse(sourceCode, {
    sourceType: "module",
  });
  const deps = [];
  traverse.default(ast, {
    // 获取导入的节点
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });
  return {
    filePath,
    code,
    deps,
    id: id++,
    mapping: {},
  };
}
// const asset=createAsset();
// console.log(asset)

function createGraph() {
  const mainAsset = createAsset("./example/main.js");
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath));
      asset.mapping[relativePath] = child.id;
      // 深度优先遍历
      queue.push(child);
    });
  }
  return queue;
}

// console.log(createGraph());
const graph = createGraph();

function build(graph) {
  const template = fs.readFileSync("./bundle.ejs", "utf-8");
  const data = graph.map((asset) => {
    return {
      id:asset.id,
      filePath: asset.filePath,
      code: asset.code,
      mapping: asset.mapping,
    };
  });
  const content = ejs.render(template, { data });

  fs.writeFileSync("./dist/bundle.js", content);
}

build(graph);
