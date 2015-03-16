# HTML5 Environmental Thermometer

This repository contains the demo I've developed as a part of an article titled [Create Your Own HTML5 Environmental Thermometer](http://www.sitepoint.com/hot-stuff-make-your-own-html5-environmental-thermometer/) written for
[SitePoint](http://www.sitepoint.com/). [HTML5 Environmental Thermometer](https://github.com/AurelioDeRosa/HTML5-Environmental-Thermometer) is a simple and adaptive environmental thermometer created to show the potentiality of the union of some of the brand new web technologies as HTML5, CSS3, geolocation API and others. 

This demo uses a semantic and as more as possible detailed HTML5 markup and both CSS3 and JavaScript for styling and positioning the thermometer in order to look like a real environmental thermometer. Since it uses an SVG background image, it can be adapted to different sizes without being stretched. However, in the folder there's also a PNG background image to support the older browsers which don't support SVG. 

The most interesting part of this demo regards the positioning of the thermometer and its labels. In fact, since the thermometer is 90° rotated, CSS3 is not sufficient to center it and JavaScript has to be used. Moreover the latter has been used to set the number of labels dynamically and to evenly space each other.

While for some of these I used just a pinch, to make the thermometer I employ the followings:

* HTML5 for the markup
* CSS3 to style the demo
* JavaScript + jQuery to adjust the thermometer position and to set and position its labels
* SVG for the background to be adaptive as much as it can
* Polyfill to support the browsers that don't support the `meter` element
* Geolocation API to get the user current position
* Google Maps API to convert the geolocation into an address
* Yahoo! Weather API to retrieve the WOEID code and the temperature

## Demo

A live demo is available [here](http://aurelio.audero.it/demo/HTML5-Environmental-Thermometer/index.html).

## License

[HTML5 Environmental Thermometer](https://github.com/AurelioDeRosa/HTML5-Environmental-Thermometer) is dual licensed under [MIT](http://www.opensource.org/licenses/MIT) and [GPL-3.0](http://opensource.org/licenses/GPL-3.0)

## Author

[Aurelio De Rosa](http://www.audero.it) ([@AurelioDeRosa](https://twitter.com/AurelioDeRosa))