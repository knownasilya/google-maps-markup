# google-maps-markup

Drawing and measurement tools for a Google Map

[![npm version](https://badge.fury.io/js/google-maps-markup.svg)](http://badge.fury.io/js/google-maps-markup)
[![Build Status](https://travis-ci.org/knownasilya/google-maps-markup.svg)](https://travis-ci.org/knownasilya/google-maps-markup)
[![Coverage Status](https://coveralls.io/repos/knownasilya/google-maps-markup/badge.svg?branch=master&service=github)](https://coveralls.io/github/knownasilya/google-maps-markup?branch=master)
[![Ember Observer Score](http://emberobserver.com/badges/google-maps-markup.svg)](http://emberobserver.com/addons/google-maps-markup)

[Preview Demo]

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
- `afterClearResults` - Fires after clicking "Clear" for a mode. Passes the mode as the first argument, i.e `afterClearResults(mode) {}`.

### Service

The service is called `markupData` and allows access to the result data that gets created when you
create markup on the map. It also has some helper functions.

```js
markupData: Ember.inject.service()
```

#### Properties

- `layers` - Array of Google Maps Data layers, one for draw and one for measure.
- `results` - Markup data for each markup you create, based on mode. See `markupResults` for all results.
- `markupResults` - The object of all the results, no matter the mode.
- `mode` - The drawing mode, either 'draw' or 'measure'.

#### Methods

- `activate` - Add all layers to the map. `activate(map)`.
- `changeModeByResults` - Changes the mode to the first layer with results.
- `featureToResult` - Converts a Google Maps Data Feature to a markup result, for loading data without
  actually drawing on the map (ie, load via url). `featureToResult(feature, layer)`.



## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For developing locally with your app, you can use `DEVELOPING=true npm start` for your app, and
`npm link path/to/this/addon` and your app will automatically rebuild as you make changes to your
local version of this addon.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

[Preview Demo]: http://knownasilya.github.io/google-maps-markup
