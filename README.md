# google-maps-markup

Drawing and measurement tools for a Google Map

[![npm version](https://badge.fury.io/js/google-maps-markup.svg)](http://badge.fury.io/js/google-maps-markup)
[![Build Status](https://travis-ci.org/knownasilya/google-maps-markup.svg)](https://travis-ci.org/knownasilya/google-maps-markup)
[![Coverage Status](https://coveralls.io/repos/knownasilya/google-maps-markup/badge.svg?branch=master&service=github)](https://coveralls.io/github/knownasilya/google-maps-markup?branch=master)
[![Ember Observer Score](http://emberobserver.com/badges/google-maps-markup.svg)](http://emberobserver.com/addons/google-maps-markup)

[Preview Demo]

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Usage

```bash
ember install google-maps-markup
```

```hbs
{{google-maps-markup map=map}}
```

### Available Attributes

- `map` - **REQUIRED**; Google Map instance, defaults to `undefined`. Bring your own map!
- `editable` - (experimental) Allow shapes to be edited. Defaults to `true`.
- `panForOffscreen` - On hover pan to shape if not in view (reset to last bounds after). Defaults to `true`.
- `autoResetToPan` - After drawing a shape the tool changes to "Pan" instead of staying on the current tool. Defaults to `false`.

#### Actions

- `afterAddFeature` - Fires after finishing some markup on the map. Passes the result as the first argument, i.e. `afterAddFeature(result) {}`.
- `afterClearResults` - Fires after clicking "Clear"

### Service

The service is called `markupData` and allows access to the result data that gets created when you
create markup on the map. It also has some helper functions.

```js
markupData: Ember.inject.service();
```

#### Properties

- `layer` - Google Maps Data layer
- `results` - Markup data for each markup you create

#### Methods

- `activate` - Add the google layer to the map. `activate(map)`.
- `featureToResult` - Converts a Google Maps Data Feature to a markup result, for loading data without
  actually drawing on the map (ie, load via url). `featureToResult(feature, layer)`.

## Installation

- `git clone` this repository
- `npm install`
- `bower install`

### Linting

- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For developing locally with your app, you can use `DEVELOPING=true npm start` for your app, and
`npm link path/to/this/addon` and your app will automatically rebuild as you make changes to your
local version of this addon.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Github Pages/Demo

Build by checking out the relevant branch, since the test dummy app
is actually the demo app.

Run the following command:

```no-highlight
ember github-pages:commit --message <message describing demo release>
```

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

[preview demo]: http://knownasilya.github.io/google-maps-markup
