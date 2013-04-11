/*
 * LICENSE: HTML5 environmental thermometer is dual licensed under
 * the MIT license and GPL-3.0 license. More details can be found here
 * http://www.opensource.org/licenses/MIT and
 * here http://opensource.org/licenses/GPL-3.0
 *
 * @author  Aurelio De Rosa <aurelioderosa@gmail.com>
 * @link    https://github.com/AurelioDeRosa/HTML5-Environmental-Thermometer
 * @version 1.0
 */

/*
 * Set the position of the thermometer element. Since the thermometer
 * is vertically rotated (90° rotated) CSS is not sufficient to center it
 * in its container. Thus, JavaScript is used to give a better look and
 * to simulate a real environmental thermometer. Moreover a calculation
 * is performed to set the number of labels,
 * to evenly space each other and it is adjustable in the code.
 */
function setThermometerPosition()
{
   // The thermometer object
   var thermometer = jQuery('#thermometer');
   // The max value of the thermometer
   var max = parseFloat(thermometer.attr('max'));
   // The min value of the thermometer
   var min = parseFloat(thermometer.attr('min'));
   // Put the label every "step" numbers. This value should be a divisor
   // of the difference between max and min
   var step = 10;
   // The margin between every label
   var margin = 0;
   // The wrapper of the thermometer
   var wrapper = jQuery('#thermometer-wrapper');
   // The wrapper of the labels
   var labels = jQuery('#labels');

   // Calculates the position of the thermometer
   thermometer.width(0.9 * wrapper.height());
   thermometer.css('bottom', ((wrapper.height() - thermometer.height()) / 2) + 'px');
   thermometer.css('left', (thermometer.width() - wrapper.width()) / -2);

   // Calculates the space between each label
   margin = (thermometer.width() + (parseFloat(labels.css('font-size')) / 2)) / ((max - min) / step);
   margin -=  parseFloat(labels.css('font-size'));

   // Creates and attaches the thermometer labels
   createThermometerLabels(max, min, step, margin);
}

/*
 * Creates and adds the thermometer labels
 */
function createThermometerLabels(max, min, step, margin)
{
   var label;
   var container = jQuery('#labels');
   for(var i = max; i >= min; i -= step)
   {
      label = jQuery('<label>').addClass('thermometer-label').text(i + '°');
      label.css('margin-bottom', margin);
      container.append(label);
   }

   setLabelsPosition();
}

/*
 * Sets the position of the wrapper that contains the thermometer's labels
 */
function setLabelsPosition()
{
   // The wrapper of the labels
   var labels = jQuery('#labels');

   labels.css('margin-top', (labels.parent().height() - labels.height()) / 2);
   labels.width((jQuery('#thermometer-wrapper').width() - $('#thermometer').height()) /2);
}

/*
 * Does a request to the Yahoo! API to get the WOEID code based on the
 * location written by the user or retrieved using the Google maps API
 */
function requestWOEID(location)
{
   var query = 'select * from geo.places where text = "' + location + '"';

   jQuery.get(
      'http://query.yahooapis.com/v1/public/yql?callback=?&format=json&q=' + encodeURIComponent(query),
      function(data)
      {
         if (data.query.count == 0)
         {
            setError('Unable to retrieve data');
            return;
         }
         if (data.query.count > 1)
         {
            setError('More than one place found so the best guess has been shown. Please, be more specific (eg. including the state or nation like: Frattamaggiore, Campania, Italy)');
            data.query.results.place = data.query.results.place[0];
         }
         var url = 'http://weather.yahooapis.com/forecastrss?u=c&w=' + data.query.results.place.woeid;
         var query = 'select * from rss where url = "' + url + '"';

         // Does a request to the Yahoo! weather API to get the temperature
         jQuery.get(
            'http://query.yahooapis.com/v1/public/yql?callback=?&format=json&q=' + encodeURIComponent(query),
            function(data)
            {
               if (data.query.results.item.condition == undefined)
               {
                  setError(data.query.results.item.title);
                  return;
               }
               // Set the temperature retrieved on the meter who rapresent the thermometer
               // and as text in the dedicated label
               var temperature = data.query.results.item.condition.temp;
               jQuery('#temperature').text(temperature + '°');
               jQuery('#thermometer').attr('value', temperature);
            },
            'json'
         );
      },
      'json'
   )
}

/*
 * Does a request to the Google maps API to retrieve an address using the location
 * of the user based on his or her current latitude and longitude.
 */
function requestLocation(position)
{
   new google.maps.Geocoder().geocode(
      {'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)},
      function(results, status)
      {
         if (status == google.maps.GeocoderStatus.OK)
            jQuery('#location').attr('value', results[0].formatted_address);
         else
            setError('Unable to retrieve location');
      }
   );
}

/*
 * Sets the message error
 */
function setError(message)
{
   jQuery('#error').text(message);
}

/*
 * Resets all the previous information
 */
function resetInfo()
{
   setError('');
   jQuery('#city').text('-');
   jQuery('#temperature').text('-');
}