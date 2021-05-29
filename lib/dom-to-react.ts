import {attributesToProps, Props} from './attributes-to-props';
import {setStyleProp, PRESERVE_CUSTOM_ATTRIBUTES, isCustomComponent, DOMNode} from './utilities';
import * as React from 'react';

export { DOMNode };

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

/**
 * Converts DOM nodes to JSX element(s).
 *
 * @param  {DomElement[]} nodes             - DOM nodes.
 * @param  {object}       [options={}]      - Options.
 * @param  {Function}     [options.replace] - Replacer.
 * @param  {object}       [options.library] - Library (React/Preact/etc.).
 * @return {string|JSX.Element|JSX.Element[]}
 */
export function domToReact(
  nodes: DOMNode[],
): string | JSX.Element | JSX.Element[] {

  const library = React;
  // const cloneElement = library.cloneElement;
  const createElement = library.createElement;
  // const isValidElement = library.isValidElement;

  let result = [];
  let node;
  // const hasReplace = typeof options.replace === 'function';
  // let replaceElement;
  let props;
  let children;
  // let data;
  // const trim = options.trim;

  for (let i = 0, len = nodes.length; i < len; i++) {
    node = nodes[i];
    console.log('node', node);

    // // replace with custom React element (if present)
    // if (hasReplace) {
    //   replaceElement = options.replace(node);

    //   if (isValidElement(replaceElement)) {
    //     // set "key" prop for sibling elements
    //     // https://fb.me/react-warning-keys
    //     if (len > 1) {
    //       replaceElement = cloneElement(replaceElement, {
    //         key: replaceElement.key || i
    //       });
    //     }
    //     result.push(replaceElement);
    //     continue;
    //   }
    // }

    if (node.nodeType === TEXT_NODE) {
      // if trim option is enabled, skip whitespace text nodes
      // if (trim) {
      //   data = node.data.trim();
      //   if (data) {
      //     result.push(node.data);
      //   }
      // } else {
        console.log('pushing node data', (node as Text).data);
        result.push((node as Text).data);
      // }
      continue;
    }

    node = node as Element;
    props = node.attributes;
    if (skipAttributesToProps(node) && props.getNamedItem) {
      if (props.getNamedItem('style')?.value) {
        console.log('try to get style');
        setStyleProp(props.getNamedItem('style')?.value as string, props);
      }
      
    } else if (props) {
      props = attributesToProps(props);
    }

    children = null;

    switch (node.nodeType) {
      // case 'script':
      // case 'style':
      //   // prevent text in <script> or <style> from being escaped
      //   // https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
      //   if (node.children[0]) {
      //     props.dangerouslySetInnerHTML = {
      //       __html: node.children[0].data
      //     };
      //   }
      //   break;

      case ELEMENT_NODE:
        console.log('node type is tag', node);
        // setting textarea value in children is an antipattern in React
        // https://reactjs.org/docs/forms.html#the-textarea-tag
        // if (node.nodeName === 'textarea' && node.children[0]) {
        //   props.defaultValue = node.children[0].data;
        // } else
        node = node as Element;
        if (node.childNodes && node.childNodes.length) {
          // continue recursion of creating React elements (if applicable)
          children = [];
        
          for (let i = 0; i < node.childNodes.length; i++) {
            let child;
            const childNode = (node as Element).childNodes[i];
            if (childNode) {
              child = domToReact([childNode as DOMNode]);
            }
            if (child) {
              children.push(child);
            }
          }
        }
        break;

      // skip all other cases (e.g., comment)
      default:
        continue;
    }

    // set "key" prop for sibling elements
    // https://fb.me/react-warning-keys
    if (len > 1) {
      //@ts-ignore
      props['key'] = i;
    }

    result.push(createElement(node.nodeName, props as Props, children));
    console.log('pushed to result', result[result.length - 1]);
  }
  
  // @ts-ignore
  return result.length === 1 ? result[0] : result;
}

/**
 * Determines whether DOM element attributes should be transformed to props.
 * Web Components should not have their attributes transformed except for `style`.
 *
 * @param  {DomElement} node
 * @return {boolean}
 */
function skipAttributesToProps(node: Element) {
  return (
    PRESERVE_CUSTOM_ATTRIBUTES &&
    node.nodeType === ELEMENT_NODE &&
    isCustomComponent(node.nodeName, node.attributes)
  );
}