'use strict';

const garbage = /[\s,]/;
const operators = /[()[\]]/;
const digits = /\d/;
const identifiers = /[a-zA-Z+\-*/]/;

module.exports = function lexer(input) {
  const tokens = [];

  let current;
  let index = 0;

  function advance() {
    current = input[index += 1];

    return current;
  }

  function lookAhead() {
    return input[index + 1];
  }

  function lookBehind() {
    return input[index - 1];
  }

  while (index < input.length) {
    current = input[index];

    if (garbage.test(current)) {
      advance();
    } else if (operators.test(current)) {
      tokens.push({
        type: 'operator',
        value: current,
      });

      advance();
    } else if (digits.test(current)) {
      let num = lookBehind() === '-' ? `-${current}` : current;

      while (digits.test(advance())) {
        num += current;
      }

      if (current === '.') {
        do {
          num += current;
        } while (digits.test(advance()));
      }

      num = parseFloat(num);

      tokens.push({
        type: 'number',
        value: num,
      });
    } else if (identifiers.test(current)) {
      let idn = current;

      if (idn !== '-' || !digits.test(lookAhead())) {
        while (identifiers.test(advance())) {
          idn += current;
        }

        tokens.push({
          type: 'identifier',
          value: idn,
        });
      } else {
        advance();
      }
    } else {
      throw new Error(`Unrecognized token: "${current}".`);
    }
  }

  return tokens;
};
