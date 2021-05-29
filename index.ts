import {domToReact, DOMNode} from './lib/dom-to-react';

/**
 * Converts HTML string to React elements.
 *
 * @param  {String}   html                    - HTML element.
 * @return {JSX.Element|JSX.Element[]|String} - React element(s), empty array, or string.
 */
export default function HTMLReactParser(html: DOMNode[]) {
  return domToReact(html);
}