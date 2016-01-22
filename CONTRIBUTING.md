# Contributing Guide

Contributions are welcome and are greatly appreciated! Every little bit helps, and credit will
always be given.

## Issues Guidelines

Before you submit an issue, check that it meets these guidelines:

- specify the version of `tcomb-form` you are using
- specify the version of `react` you are using
- if the issue regards a bug, please provide a minimal failing example / test (see "How to setup an example on codepen.io")

## How to setup an example on [codepen.io](http://codepen.io/)

Configuration:

**CSS**

- https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css

**JS**

JavaScript Preprocessor: Babel

- //cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react.js
- //cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react-dom.js
- https://npmcdn.com/tcomb-form/dist/tcomb-form.js (or https://npmcdn.com/tcomb-form/dist/tcomb-form.min.js)

## Pull Request Guidelines

Before you submit a pull request from your forked repo, check that it meets these guidelines:

1. If the pull request fixes a bug, it should include tests that fail without the changes, and pass
with them.
2. If the pull request adds functionality, the docs should be updated as part of the same PR.
3. Please rebase and resolve all conflicts before submitting.

## Setting up your environment

After forking tcomb-form to your own github org, do the following steps to get started:

```sh
# clone your fork to your local machine
git clone https://github.com/gcanti/tcomb-form.git

# step into local repo
cd tcomb-form

# install dependencies
npm install

# build lib folder (optional)
npm run watch
```

### Running Tests

```sh
# run tests
npm test
```

### Style & Linting

This codebase adheres to the [Airbnb Styleguide](https://github.com/airbnb/javascript) with a few tweaks and is
enforced using [ESLint](http://eslint.org/).

It is recommended that you install an eslint plugin for your editor of choice when working on this
codebase, however you can always check to see if the source code is compliant by running:

```sh
npm run lint
```

