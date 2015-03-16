/*
 * LICENSE: HTML5 environmental thermometer is dual licensed under
 * the MIT license and GPL-3.0 license. More details can be found here
 * http://www.opensource.org/licenses/MIT and
 * here http://opensource.org/licenses/GPL-3.0
 *
 * @author  Aurelio De Rosa <a.derosa@audero.it>
 * @link    https://github.com/AurelioDeRosa/HTML5-Environmental-Thermometer
 */

/*
 * Set the position of the thermometer element. Since the thermometer
 * is vertically rotated (90° rotated) CSS is not sufficient to center it
 * in its container. Thus, JavaScript is used to give a better look and
 * to simulate a real environmental thermometer. Moreover a calculation
 * is performed to set the number of labels,
 * to evenly space each other and it is adjustable in the code.
 */
(function($) {

   /**
    * The constructor of the Thermometer object. It also initializes the position
    * of the thermometer inside its parent.
    *
    * @param {Object} options An object containing the id of the elements needed.
    * All its properties are mandatory and are:
    *
    * - thermometerId: The id of the meter element acting as a thermometer
    * - labelsId: The id of the element containing the labels of the thermometer
    * - errorId: The id of the element showing the errors of the demo
    * - cityId: The id of the element showing the current city of the user
    * - temperatureId: The id of the element showing the current temperature
    *
    * @constructor
    */
   var Thermometer = function(options) {
      // The thermometer object
      this.$thermometer = $('#' + options.thermometerId);
      // The wrapper of the thermometer
      this.$thermometerWrapper = this.$thermometer.parent();
      // The wrapper of the labels
      this.$labels = $('#' + options.labelsId);
      // The element showing the errors of the demo
      this.$error = $('#' + options.errorId);
      // The element showing the current city of the user
      this.$city = $('#' + options.cityId);
      // The element showing the current temperature
      this.$temperature = $('#' + options.temperatureId);

      /**
       * Sets the position of the thermometer element
       */
      var setThermometerPosition = function() {
         // The max value of the thermometer
         var max = window.parseFloat(this.$thermometer.attr('max'));
         // The min value of the thermometer
         var min = window.parseFloat(this.$thermometer.attr('min'));
         // Put the label every "step" numbers. This value should be a divisor
         // of the difference between max and min
         var step = 10;
         // The margin between every label
         var margin = 0;

         // The thermometer is vertically rotated (90° rotated) and its width
         // is modified programatically. So, CSS is not sufficient to center it
         // in its container.

         // Calculates the position of the thermometer
         var newWidth = 0.9 * this.$thermometerWrapper.height();
         this.$thermometer.css({
            width: newWidth,
            bottom: (this.$thermometerWrapper.height() - this.$thermometer.height()) / 2,
            left: (newWidth - this.$thermometerWrapper.width()) / -2
         });

         // Creates and appends the thermometer labels
         createThermometerLabels(max, min, step, margin);
      }.bind(this);

      /**
       * Creates and adds the thermometer labels
       *
       * @param {number} max
       * @param {number} min
       * @param {number} step
       */
      var createThermometerLabels = function(max, min, step) {
         // Calculates the space between each label
         var margin = this.$thermometer.width() + (window.parseFloat(this.$labels.css('font-size')) / 2);
         margin = margin / ((max - min) / step);
         margin -=  window.parseFloat(this.$labels.css('font-size'));

         var labels = [];
         for(var i = max; i >= min; i -= step) {
            labels.push(
               $('<label>')
                  .addClass('thermometer-label')
                  .css('margin-bottom', margin)
                  .text(i + '°')
            );
         }
         this.$labels.append(labels);

         setLabelsPosition();
      }.bind(this);

      /**
       * Sets the position of the wrapper that contains the thermometer's labels
       */
      var setLabelsPosition = function() {
         this.$labels.css({
            width: (this.$thermometerWrapper.width() - this.$thermometer.height()) / 2,
            marginTop: (this.$labels.parent().height() - this.$labels.height()) / 2
         });
      }.bind(this);

      // Adjust the thermometer position
      setThermometerPosition();
   };

   window.Thermometer = Thermometer;

})(jQuery, window);

/**
 * Performs a request to the Yahoo! API to get the WOEID code based on the
 * location written by the user or retrieved using the Google maps API
 *
 * @param {Object} location
 * @returns {Thermometer}
 */
Thermometer.prototype.requestWOEID = function(location) {
   var query = 'select * from geo.places where text = "' + location + '"';
   this.$city.text(location);
   var that = this;

   $.getJSON(
      'http://query.yahooapis.com/v1/public/yql?callback=?&format=json&q=' + encodeURIComponent(query),
      function(data)
      {
         if (data.query.count === 0)
         {
            that.$error.text('Unable to retrieve data');
            return;
         } else if (data.query.count > 1) {
            that.$error.text('More than one place found so the best guess has been shown. Please, be more specific (eg. including the state or nation like: Frattamaggiore, Campania, Italy)');
            data.query.results.place = data.query.results.place[0];
         }

         var url = 'http://weather.yahooapis.com/forecastrss?u=c&w=' + data.query.results.place.woeid;
         var query = 'select * from rss where url = "' + url + '"';

         // Does a request to the Yahoo! weather API to get the temperature
         $.getJSON(
            'http://query.yahooapis.com/v1/public/yql?callback=?&format=json&q=' + encodeURIComponent(query),
            function(data)
            {
               var item = data.query.results.item;
               if (item.condition === undefined)
               {
                  that.$error.text(item.title);
                  return;
               }
               // Sets the temperature retrieved as a value of the element
               // representing the thermometer and as text of the element
               // showing the temperature
               that.$temperature.text(item.condition.temp + '°');
               that.$thermometer.val(item.condition.temp);
            }
         );
      }
   );

   return this;
};

/**
 * Resets all the previous information.
 *
 * @returns {Thermometer}
 */
Thermometer.prototype.resetInfo = function() {
   this.$error.text('');
   this.$city.text('-');
   this.$temperature.text('-');

   return this;
};