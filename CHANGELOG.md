# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.2.0"></a>
# [2.2.0](https://github.com/knownasilya/google-maps-markup/compare/v2.1.3...v2.2.0) (2017-10-16)


### Bug Fixes

* add back dependencies missed during cli upgrade ([401ea0a](https://github.com/knownasilya/google-maps-markup/commit/401ea0a))
* make edit mode exclusive ([1bf8fb2](https://github.com/knownasilya/google-maps-markup/commit/1bf8fb2))
* result item hover on the full draggable element ([931fd68](https://github.com/knownasilya/google-maps-markup/commit/931fd68))


### Features

* hover markup on map mouse interaction ([0fb9ec3](https://github.com/knownasilya/google-maps-markup/commit/0fb9ec3))



<a name="2.1.3"></a>
## [2.1.3](https://github.com/knownasilya/google-maps-markup/compare/v2.1.2...v2.1.3) (2017-10-16)


### Bug Fixes

* missing event in dblclick handler for measurement plotter ([cf9d549](https://github.com/knownasilya/google-maps-markup/commit/cf9d549))



<a name="2.1.2"></a>
## [2.1.2](https://github.com/knownasilya/google-maps-markup/compare/v2.1.1...v2.1.2) (2017-10-16)


### Bug Fixes

* freeform activating on of the dm tools if those clicked before hand ([f5483b1](https://github.com/knownasilya/google-maps-markup/commit/f5483b1))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/knownasilya/google-maps-markup/compare/v2.1.0...v2.1.1) (2017-10-16)


### Bug Fixes

* freeform polygon keeping path drawing around after finishing shape ([34b07ab](https://github.com/knownasilya/google-maps-markup/commit/34b07ab))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/knownasilya/google-maps-markup/compare/v2.0.3...v2.1.0) (2017-10-15)


### Bug Fixes

* add autoreset to freeform poly and change tool (to text as well) ([e24a6f3](https://github.com/knownasilya/google-maps-markup/commit/e24a6f3))
* add eps dep explicitly, styles and remove old stuff ([7d54b58](https://github.com/knownasilya/google-maps-markup/commit/7d54b58))
* build issue fixed ([#26](https://github.com/knownasilya/google-maps-markup/issues/26)) ([f69bc31](https://github.com/knownasilya/google-maps-markup/commit/f69bc31))
* Can only enter one text character ([#27](https://github.com/knownasilya/google-maps-markup/issues/27)) ([17d50f1](https://github.com/knownasilya/google-maps-markup/commit/17d50f1))
* certain styles leaking into others ([77a546f](https://github.com/knownasilya/google-maps-markup/commit/77a546f))
* Circle or Rectangle on the map is getting draw without fill color ([#24](https://github.com/knownasilya/google-maps-markup/issues/24)) ([5c00d8f](https://github.com/knownasilya/google-maps-markup/commit/5c00d8f))
* drag and drop ui layout ([52368fc](https://github.com/knownasilya/google-maps-markup/commit/52368fc))
* dynamic-label error when removing ([78155d3](https://github.com/knownasilya/google-maps-markup/commit/78155d3))
* edit allowed by default, editable option only enables shape editing ([4127a5a](https://github.com/knownasilya/google-maps-markup/commit/4127a5a))
* freeform drawing with mobile ([d83256f](https://github.com/knownasilya/google-maps-markup/commit/d83256f))
* freeform polygon transparent by and styles leaking ([354c68e](https://github.com/knownasilya/google-maps-markup/commit/354c68e))
* infowindow popup during edit ([7caa87e](https://github.com/knownasilya/google-maps-markup/commit/7caa87e))
* make fill color checkbox clickable with label ([1ce1529](https://github.com/knownasilya/google-maps-markup/commit/1ce1529))
* make markers not editable for now ([e33297f](https://github.com/knownasilya/google-maps-markup/commit/e33297f))
* marker hover/zindex change ([59ce53d](https://github.com/knownasilya/google-maps-markup/commit/59ce53d))
* modules codemod ran ([a5ca8de](https://github.com/knownasilya/google-maps-markup/commit/a5ca8de))
* move data to another file ([d6ee138](https://github.com/knownasilya/google-maps-markup/commit/d6ee138))
* **deps:** remove unused bower deps, update merge trees ([be946ab](https://github.com/knownasilya/google-maps-markup/commit/be946ab))
* normalize options into a component ([a43960b](https://github.com/knownasilya/google-maps-markup/commit/a43960b))
* options layout and rectangle missing stroke weight ([55d29fc](https://github.com/knownasilya/google-maps-markup/commit/55d29fc))
* options size on small screen ([3422463](https://github.com/knownasilya/google-maps-markup/commit/3422463))
* text fontsize changing and position during zoom and sizing ([98c35c3](https://github.com/knownasilya/google-maps-markup/commit/98c35c3))
* unit issues and how units are saved. Remove data from tools ([d426d81](https://github.com/knownasilya/google-maps-markup/commit/d426d81))
* update deps and fix text label in items list ([b72a5de](https://github.com/knownasilya/google-maps-markup/commit/b72a5de))
* update linting, remove unused jshint config ([bd515d3](https://github.com/knownasilya/google-maps-markup/commit/bd515d3))
* Update to ember-cli 2.16 ([2563baf](https://github.com/knownasilya/google-maps-markup/commit/2563baf))


### Features

* Ability to change line width of markup/measurement ([#22](https://github.com/knownasilya/google-maps-markup/issues/22)) ([3090d60](https://github.com/knownasilya/google-maps-markup/commit/3090d60))
* Add option to change font size for text ([#23](https://github.com/knownasilya/google-maps-markup/issues/23)) ([32e7890](https://github.com/knownasilya/google-maps-markup/commit/32e7890))
* Allow reorder markup in the list ([#20](https://github.com/knownasilya/google-maps-markup/issues/20)) ([e9c5105](https://github.com/knownasilya/google-maps-markup/commit/e9c5105))
* bring forward to the top any markup when you hover over it in the list ([#21](https://github.com/knownasilya/google-maps-markup/issues/21)) ([4d81b98](https://github.com/knownasilya/google-maps-markup/commit/4d81b98))
* Create a choice of measurement units ([#19](https://github.com/knownasilya/google-maps-markup/issues/19)) ([dc2bdc0](https://github.com/knownasilya/google-maps-markup/commit/dc2bdc0))
* Individual markups editing (colors, opacity) ([#25](https://github.com/knownasilya/google-maps-markup/issues/25)) ([28b28ca](https://github.com/knownasilya/google-maps-markup/commit/28b28ca))
