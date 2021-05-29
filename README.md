# html-react-parser

A simplified implementation of html-react-parser that takes in a set of HTMLElements and returns a set of JSX.Element's equivalent of the given HTMLElements.

Original Source: [![NPM version](https://img.shields.io/npm/v/html-react-parser.svg)](https://www.npmjs.com/package/html-react-parser)

HTML to React parser that works on both the server (Node.js) and the client (browser):

```
HTMLReactParser(elements: DOMNode[])
```

where DOMNode currently only consists of types Element | Text.

The parser converts HTMLElements to one or more [React elements](https://reactjs.org/docs/react-api.html#creating-react-elements).

To replace an element with another element: not currently supported.

## Example

```js
import HTMLReactParser from '../from/some/local/published/package/html-react-parser';
const someDiv = document.createElement('div');

HTMLReactParser(someDiv); // React.createElement('div', {})
```

## Install

Currently no published package is available for this utility.