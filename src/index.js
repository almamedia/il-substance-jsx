const RENAMED_PROPS = [
  {
    propName: 'className',
    attrName: 'class'
  },
  {
    propName: 'htmlFor',
    attrName: 'for',
  }
];

/**
 * Takes components props, and extracts events defined using react event syntax
 * (ie. `onClick`).
 *
 * Event prop name needs to start with prefix "on", predeced by the event name,
 * starting with a single uppercase letter. This will be considered to mean the
 * event with similar name in lowercase. The prop `onClick` will be translated
 * to `click` event.
 *
 * @param {Object} props - Original component's props, given in jsx.
 * @returns {Object} Returns object containing event's name, handler as a
 * callback function, and the original prop name of the event given to jsx.
 */
function getEventHandlers(props) {
  const propNames = Object.keys(props);

  const eventHandlerPropNames = propNames.filter((propName) => {
    return propName.match(/^on[A-Z]/);
  });

  const eventHandlers = eventHandlerPropNames.map((propName) => {
    return {
      name: propName.substr(2).toLowerCase(),
      callback: props[propName],
      originalPropName: propName,
    };
  });

  return eventHandlers || [];
}

/**
 * Takes components props, and extracts renamed props (eg. `className`,
 * `htmlFor`) from it.
 *
 * @param {Object} props - Original component's props, given in jsx.
 * @returns {Object} Returns object containing any passed renamed props and
 * their values, and original prop names used.
 */
function getRenamedProps(props) {
  const renamedProps = RENAMED_PROPS.filter((renamedProp) => {
    return props.hasOwnProperty(renamedProp.propName);
  });

  const newProps = renamedProps.map((prop) => {
    return {
      name: prop.attrName,
      value: props[prop.propName],
      originalPropName: prop.propName,
    };
  });

  return newProps || [];
}

/**
 * Takes components props, and extracts special props (eg. `ref`, `value`) from
 * it.
 *
 * @param {Object} props - Original component's props, given in jsx.
 * @param {boolean} [isComponent] - True if element is custom component, and not
 * a dom element.
 * @returns {Object} Returns object containing any passed special props and
 * their values, and original prop names used.
 */
function getSpecialProps(props, isComponent) {

  const specialProps = {};

  if (props.hasOwnProperty('ref')) {
    specialProps.ref = {
      value: props.ref,
      originalPropName: 'ref',
    }
  }

  if (!isComponent && props.hasOwnProperty('value')) {
    specialProps.val = {
      value: props.value,
      originalPropName: 'value',
    }
  }

  return specialProps
}

/**
 * Takes original props, and creates a new props object based on it, with given
 * prop names removed from it.
 *
 * @param {Object} props - Original component's props, given in jsx.
 * @param {...string} propsToOmit - Names of the props that should be cleaned
 * from props.
 * @returns {Object} Returns a new props object, cleaned from the props that
 * were given.
 */
function tidyProps(props, ...propsToOmit) {

  const cleanProps = {
    ...props,
  };

  propsToOmit.forEach((propName) => {
    delete cleanProps[propName];
  });

  return cleanProps;
}

/**
 * Creates component using substance's jquery like tools.
 *
 * @param {Object} $$ - Substance's jack-of-all-traders object, used for
 * component creation.
 * @param {Object} element - Element to be created.
 * @param {Object} props - Original component's props, given in jsx.
 * @param {Object[]} events - Any events that need to be registered.
 * @param {Object} children - Children that need to be appended to the element.
 * @returns {Object} Returns substance component object, ready to be rendered.
 */
function createComponent($$, {element, props={}, events=[], specialProps={}, children}) {

  let component = $$(element, props);

  events.forEach((event) => {
    component.on(event.name, event.callback);
  });

  if (specialProps.ref) {
    component.ref(specialProps.ref.value);
  }

  if (specialProps.val) {
    component.val(specialProps.val.value);
  }

  children.forEach((child) => {
    component.append(child);
  });

  return component;
}

/**
 * Function for evaluating jsx code.
 *
 *
 * You need to set jsx pragma either in your code per file, or set it in `.babelrc`.
 *
 *
 * ## Using inside js file:
 *
 * ```
 * /* @jsx dom * /                  // <-- regular multiline js comment
 * ```
 *
 * Then normally import this function, before using jsx inside that file.
 *
 * @see {@link https://babeljs.io/docs/plugins/transform-react-jsx/|babel jsx
 * pragma documentation} for more information.
 *
 * @param {Object|string} element - Element object or string, if html/xml element.
 * @param {Object} props -
 * @param {...Object|string} children - Children elements of this element.
 * @returns {Object} Returns component as substance component object.
 */
function dom(element, props={}, ...children) {

  const $$ = this && this.$$ ? this.$$ : props.$$;

  props = props || {};

  const isComponent = typeof element !== "string";

  const eventHandlers = isComponent ? [] : getEventHandlers(props);

  const eventHandlerPropNames = eventHandlers.map((eventHandler) => {
    return eventHandler.originalPropName;
  });

  const specialProps = getSpecialProps(props, isComponent);
  const specialPropNames = Object.values(specialProps).map((prop) => {
    return prop.originalPropName;
  });

  const renamedProps = getRenamedProps(props);

  const renamedPropNames = renamedProps.map((prop) => {
    return prop.originalPropName;
  });

  props = tidyProps(props, '$$', ...eventHandlerPropNames, ...renamedPropNames, ...specialPropNames);

  const otherProps = renamedProps.reduce((newProps, prop) => {
    return {
      ...newProps,
      [prop.name]: prop.value,
    };
  }, {});

  props = {...props, ...otherProps};

  const component = createComponent($$, {element, props, events: eventHandlers, specialProps, children});

  return component;
}

export { dom };
