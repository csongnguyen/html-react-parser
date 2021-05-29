import {domToReact, DOMNode} from './lib/dom-to-react';
// import {attributesToProps} from './lib/attributes-to-props';

// export {attributesToProps, domToReact};

/**
 * Converts HTML string to React elements.
 *
 * @param  {String}   html                    - HTML element.
 * @return {JSX.Element|JSX.Element[]|String} - React element(s), empty array, or string.
 */
export default function HTMLReactParser(html: DOMNode[]) {
  //   if (typeof html !== 'string') {
  //     throw new TypeError('First argument must be a string');
  //   }
  //   if (html === '') {
  //     return [];
  //   }
  return domToReact(html);
}

export function blah(s: string) {
  console.log(s);
}

// HTMLReactParser.domToReact = domToReact;
// HTMLReactParser.attributesToProps = attributesToProps;

// support CommonJS and ES Modules
// module.exports = HTMLReactParser;
// module.exports.default = HTMLReactParser;
