'use strict';

const stdLib = {
  '+': 'function (...args) {\n' +
  '  return args.reduce((acc, curr) => acc + curr, 0);\n' +
  '}',
  '-': 'function (base = 0, ...rest) {\n' +
  '  return !rest.length ? -base || base :\n' +
  '      rest.reduce((acc, curr) => acc - curr, base);\n' +
  '}',
  '*': 'function (...args) {\n' +
  '  return args.reduce((acc, curr) => acc * curr, 1);\n' +
  '}',
  '/': 'function (base, ...rest) {\n' +
  '  return !rest.length ? 1 / base :\n' +
  '      rest.reduce((acc, curr) => acc / curr, base);\n' +
  '}',
};

module.exports = function codegen(ast) {
  const functions = new Set();

  function processNode(node, context = '') {
    let output = '';

    switch (node.type) {
      case 'Program':
        output += node.body.map(child =>
            processNode(child, 'root')).join('\n');

        break;
      case 'FunctionDeclaration':
        {
          const params = node.params.map(processNode).join(', ');
          const body = node.body.map(processNode).join(', ') || undefined;

          output += `function ${node.name}(${params}) {\n` +
          `  return ${body};\n` +
          '}';
        }

        break;
      case 'FunctionCall':
        {
          const { name: fn } = node;
          const args = node.args.map(processNode).join(', ');

          if (stdLib[fn]) {
            functions.add(fn);
            output += `__lib['${fn}']`;
          } else {
            output += fn;
          }

          output += `(${args})`;

          if (context === 'root') {
            output += ';';
          }
        }

        break;
      case 'Assignment':
        output += `let ${node.name} = ${processNode(node.value, 'root')}`;

        break;
      case 'Identifier':
        output += node.name;

        if (context === 'root') {
          output += ';';
        }

        break;
      case 'NumberLiteral':
        output += node.value;

        if (context === 'root') {
          output += ';';
        }

        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    return output;
  }

  const code = processNode(ast);

  const lib = [...functions].map(fn =>
      `__lib['${fn}'] = ${stdLib[fn]};`).join('\n');

  const chunks = [
    code,
  ];

  if (functions.size) {
    chunks.unshift('const __lib = {};', lib);
  }

  return chunks.join('\n');
};
