# il-substance-jsx

JSX for [Substance](http://substance.io/) writer.

## What does it do

This library allows usage of regular JSX syntax with Newspilot Writer's flavor of [Substance](https://substance.io) (a react fork).

## What does using JSX with substance look like?

```javascript
render($$) {

// substance with JSX

  return (
    <div>
      <MyComponent />
    </div>
  );
}

// vs

// regular substance element creation

render($$) {

  const el = $$('div');
  el.append(MyComponent);

  return el;
}
```

## Caveats

1. Differing from React, Substance requires each component to return a regular HTML DOM node as the root element from the `render` method. See `div` element in the previous example.

  ```javascript
  render($$) {

    // Will not work, root HTML element missing.
    return (
      <MyComponent />
    );
  }
  ```

  This is a feature of substance, and there's nothing `il-substance-jsx` can do to circumvent it.

2. Substance uses render method's parameter `$$` for element creation. Because of this, the variable `$$` needs to be available when using JSX.

## How to use

1. Install `il-substance-jsx`.
1. Set JSX pragma to use the custom `dom` function.
1. In code, import the custom `dom` function, used by JSX pragma.

### Installing

#### NPM

This module:

```sh
npm install --save git+ssh://github.com/almamedia/il-substance-jsx.git@0.1.0
```

Other modules:

```sh
npm install --save-dev babel babel-plugin-transform-react-jsx
```

#### YARN

This module:

```sh
yarn add git+ssh://git@github.com/almamedia/il-substance-jsx.git@0.1.0
```

Other modules:

```sh
yarn add babel babel-plugin-transform-react-jsx
```

### Setting JSX pragma

Babel plugin [`transform-react-jsx`](https://babeljs.io/docs/plugins/transform-react-jsx/) allows parsing JSX, and setting a different pragma for parsing JSX.

By default `transform-react-jsx` uses `React.createElement` as the pragma that is used to transform JSX into regular javascript.

As a relatively little known feature, its possible to configure the plugin to use a different JSX pragma, than the default `React.createElement`.

In order to transform JSX defined elements into Substance's element structure, the JSX pragma needs to point to a custom transformation function. In this case that function is `dom.bind({$$})` (no spaces allowed).

This can be done in two ways:

1. In `.babelrc` config file (for whole project).
1. With `@jsx` pragma definition comment (for each file separately).

#### Setting JSX pragma in `.babelrc`

In `.babelrc`, add the following first level object to the configuration:

```json
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "dom.bind({$$})"
    }]
  ]
}
```

More information can be found in the [plugin's](https://babeljs.io/docs/plugins/transform-react-jsx/) documentation.

#### Setting JSX pragma per file

If you don't want to use `.babelrc`, or don't want to set the pragma globally, you can also set it in each file separately.

This step needs to be done for each file separately.

The following comment specifies that in this file, the pragma will use function `dom` for parsing JSX (`dom` is defined in the next step).

```javascript
// Top of file, before any JSX calls.
/* @jsx dom.bind({$$}) */
```

### Import `dom` function.

As the last step, in order for the pragma to be able to call the mapping function `dom`, the file with JSX in it needs to import the function.

This needs to be done in every file, just like you would import `react` in every file, when you want to use jsx with react.

```javascript
// in the beginning of the file
import 'dom' from 'il-substance-jsx';
```

## Disclaimer

* This library is tested using Infomaker's Newspilot writer's flavor of Substance. It might differ from vanilla Substance.
* Only the basic functionality of JSX is currently implemented. Feel free to submit issue, if any bugs arise.
