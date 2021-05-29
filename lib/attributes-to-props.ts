import {setStyleProp, reactPropertyHtml, reactPropertySvg, isCustomAttribute, PRESERVE_CUSTOM_ATTRIBUTES} from './utilities';

export type Props = Record<string, string> & {
  style: Record<string, string>;
};

const htmlProperties = reactPropertyHtml;
const svgProperties = reactPropertySvg;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Converts HTML/SVG DOM attributes to React props.
 *
 * @param  {object} [attributes={}] - HTML/SVG DOM attributes.
 * @return {object}                 - React props.
 */
export function attributesToProps(attributes: NamedNodeMap): Props {
  // attributes = attributes || {};

  let attributeName: string;
  let attributeNameLowerCased;
  let attributeValue;
  let property;
  let props = {};

  for (attributeName in attributes) {
    const originalAttributeName = attributeName;
    if (!isNaN(parseInt(originalAttributeName))) {
      // @ts-ignore
      attributeName = attributes[originalAttributeName].name;
      // @ts-ignore
      console.log('attributeName name', attributes[originalAttributeName].name);
    }
    attributeValue = attributes[attributeName].value;
    console.log('attributeName', attributeName, 'attributeValue', attributeValue);

    // ARIA (aria-*) or custom data (data-*) attribute
    if (isCustomAttribute(attributeName)) {
      // @ts-ignore
      props[attributeName] = attributeValue;
      continue;
    }

    // convert HTML attribute to React prop
    attributeNameLowerCased = attributeName.toLowerCase();
    if (hasOwnProperty.call(htmlProperties, attributeNameLowerCased)) {
      // @ts-ignore
      property = htmlProperties[attributeNameLowerCased];
      console.log('property', property);
      // @ts-ignore
      props[property.propertyName] =
        property.hasBooleanValue ||
        (property.hasOverloadedBooleanValue && !attributeValue)
          ? true
          : attributeValue;
      continue;
    }

    // convert SVG attribute to React prop
    if (hasOwnProperty.call(svgProperties, attributeName)) {
      // @ts-ignore
      property = svgProperties[attributeName];
      // @ts-ignore
      props[property.propertyName] = attributeValue;
      continue;
    }

    // preserve custom attribute if React >=16
    if (PRESERVE_CUSTOM_ATTRIBUTES) {
      // @ts-ignore
      props[attributeName] = attributeValue;
    }
  }

  // transform inline style to object
  if (attributes.getNamedItem('style')?.value) {
    console.log('try to get style');
    setStyleProp(attributes.getNamedItem('style')?.value as string, props);
  }

  // @ts-ignore
  return props;
}
