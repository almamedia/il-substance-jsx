# il-substance-jsx

JSX for [Substance](http://substance.io/) writer.

**Disclaimer:** This library is obsolete. You can actually use substance's vanilla `$$` to do all the things the function in this repository did. You can find instructions to do so below.

## What does using jsx with substance look like?

```javascript

// substance with jsx

render($$) {

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

2. Substance uses render method's parameter `$$` for element creation. Because of this, the variable `$$` needs to be available when using JSX.

## How to use

1. Set JSX pragma to use `$$` function.
1. ???
1. Profit!

### Setting JSX pragma

Babel plugin [`transform-react-jsx`](https://babeljs.io/docs/plugins/transform-react-jsx/) allows parsing jsx, and setting a different pragma for parsing jsx.

By default `transform-react-jsx` uses `React.createElement` as the pragma that is used to transform JSX into regular javascript.

As a relatively little known feature, its possible to configure the plugin to use a different JSX pragma, than the default `React.createElement`.

In order to transform JSX defined elements into Substance's element structure, the JSX pragma needs to point to a custom transformation function. In substance's case that function is `$$`.

This can be done in two ways:

1. In `.babelrc` config file (for whole project).
1. With `@jsx` pragma definition comment (for each file separately).

#### Setting JSX pragma in `.babelrc`

In `.babelrc`, add the following first level object to the configuration:

```json
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "$$"
    }]
  ]
}
```

More information can be found in the [plugin's](https://babeljs.io/docs/plugins/transform-react-jsx/) documentation.

#### Setting JSX pragma per file

If you don't want to use `.babelrc`, or don't want to set the pragma globally, you can also set it in each file separately.

This step needs to be done for each file separately.

The following comment specifies that in the file, the pragma will use function `$$` for parsing JSX.

```javascript
// Top of file, before any JSX calls.
/* @jsx $$ */
```
