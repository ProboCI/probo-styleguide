# The Definitive Style Guide for ProboCI

This goal of this style guide is to provide designers and developers with an overview of styles for the Probo branding. We are using the Brad Frost's ["Atomic web design"](http://bradfrost.com/blog/post/atomic-web-design/) concept and recommend reading the his post prior to making changes to this guide.

## Development

First, make sure you're using node version 4 or above by executing `node -v`. It's highly recommended to use [n](https://www.npmjs.com/package/n) to switch between node versions, like `rvm` for Ruby.

Then, `cd probo-styleguide` and install the dependencies of this project with `npm install`.

Now, start developing by running `gulp`. This opens your browser and will automatically reload after changes are detected.

**Note:** when making changes, only edit files within:

1. `~/template`
2. `~/scss`

The other directors are generated, so your changes will get removed on the next build. To change the appearance of the styleguide itself, edit files in the `~/template` directory. You can change the styles by editing `~/template/public/kiss.less` or alternatively by adding a new CSS file in `~/template/public` and including it in `~/template/index.html`.

## Releasing updates

Please see [James Cole](https://github.com/tortillaj) to inquire about releasing new versions.

## Contributions

We are currently not accepting contributions at this time! Thanks!
