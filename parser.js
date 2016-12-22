'use strict';

module.exports = function parser(tokens) {
  let current = 0;

  function advance() {
    current += 1;

    return current;
  }

  function walk() {
    let token = tokens[current];

    if (token.type === 'number') {
      advance();

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'identifier') {
      advance();

      return {
        type: 'Identifier',
        name: token.value,
      };
    }

    if (token.type === 'operator' && token.value === '[') {
      const params = [];

      advance();

      token = tokens[current];

      while (token.type === 'identifier') {
        params.push(walk());
        token = tokens[current];
      }

      advance();

      return params;
    }

    if (token.type === 'operator' && token.value === '(') {
      const node = {};

      token = tokens[advance()];

      switch (token.value) {
        case 'defn':
          token = tokens[advance()];

          node.type = 'FunctionDeclaration';
          node.name = token.value;
          node.params = [];
          node.body = [];

          advance();

          node.params.push(...walk());

          while (
            tokens[current].type !== 'operator' ||
            tokens[current].value !== ')'
          ) {
            node.body.push(walk());
          }

          break;
        case 'def':
          token = tokens[advance()];

          node.type = 'Assignment';
          node.name = token.value;

          advance();

          node.value = walk();

          break;
        default:
          node.type = 'FunctionCall';
          node.name = token.value;
          node.args = [];

          advance();

          while (
            tokens[current].type !== 'operator' ||
            tokens[current].value !== ')'
          ) {
            node.args.push(walk());
          }

          break;
      }

      advance();

      return node;
    }

    throw new Error(`Unrecognized token: "${token.value}".`);
  }

  const ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
};
