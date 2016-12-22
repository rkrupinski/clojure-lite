# clojure-lite

*Disclaimer: this is a super-immature toy project :bowtie:*

`clojure-lite` compiles an extremely small subset of [clojure](https://clojure.org/) to JavaScript. That's pretty much all it does. Have fun!

It currently lets you:
- define and refer variables
- define and call functions

Other quirks:
- the standard library is limited to `+`, `-`, `*`, and `/`
- there's only one type: `number`

## Example
```clojure
(def PI 3.141592653589793)
(defn area [radius] (* PI radius radius))
(area 5)
```
is compiled to:
```javascript
const __lib = {};
__lib['*'] = function (...args) {
  return args.reduce((acc, curr) => acc * curr, 1);
};
let PI = 3.141592653589793;
function area(radius) {
  return __lib['*'](PI, radius, radius);
}
area(5);
```

## Usage
Programmatic:

```sh
$ npm install clojure-lite --save
```
```javascript
const cl = require('clojure-lite');

const compile = _.compose(
  cl.codegen,
  cl.parser,
  cl.lexer
);

const code = compile('(def answer 42)');
```

CLI:

```sh
$ npm install -g clojure-lite
```
```sh
$ echo '(def answer 42)' | cl > code.js
```

## Credits
- `lexer` heavily inspired by [[click]](https://www.codeproject.com/articles/345888/how-to-write-a-simple-interpreter-in-javascript).
- `parser` & `codegen` heavily inspired by [[click]](https://github.com/thejameskyle/the-super-tiny-compiler).
