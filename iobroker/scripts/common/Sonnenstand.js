// ioBroker object: script.js.common.Sonnenstand
// name: Sonnenstand
// engineType: Javascript/js
// enabled: False

// calculates the sun position, path and power throughout the day
// based on from http://www.stjarnhimlen.se/comp/tutorial.html
// most var-names are identical to above tutorial
// combined with Sonnenstand-Script: paul53, pix; 06.07.2015 nach ioBroker Forum http://forum.iobroker.net/viewtopic.php?f=21&t=975&sid=6f0ba055de5f82eed6809424f49ca93b#p7635
// Angepasst ykuendig 12.02.17; stringify im log, ack = true bei setState und Diverses 
 
var suncalc = require('suncalc'),
   result =  getObject("system.adapter.javascript.0"),
   lat =  result.native.latitude,
   long = result.native.longitude;
   log("long: " + long + " - lat: " + lat);
 
var modtilt =       50;     //Dachneigung in Grad (Solar panel's tilt angle)
var modazi =        285;    //Ausrichtung des Hauses in Grad zB SSW (Solar panel's azimut)
var modsufrace =    148.0;   //Paneloberfläche in m2 (Solar panel's surface in sq. meters)
var modeff =        0.211;  //Annäherung an Panel-Wirkungsgrad zB 18 Prozent (modules efficiency correction)
                                        // Hier kann an einem klaren Tag etwas geschraubt werden ;-)
 
var altitude;       // Calculated Elevation
var azimuth;        // Calculated Azimuth
 
createState('javascript.0.Solar.Sonnenstand.Elevation', 0, {unit: '°'});
createState('javascript.0.Solar.Sonnenstand.Azimut', 0, {unit: '°'});
createState('javascript.0.Solar.Sonnenstand.PanelPossible', 0, {unit: 'W'});
// ganz am Ende die setStates anpassen nicht vergessen!
 
// Do not change below, until You know what You are doing!
// ********************************************************
 
Math.degrees = function(radians) {return radians * 180 / Math.PI;};
Math.radians = function(degrees) {return degrees * Math.PI / 180;};
 
function Sonnenstand_berechnen () {
   var now = new Date();
   var sunpos = suncalc.getPosition(now, lat, long);
   log("Script Sonnenstand; latitude : " + result.native.latitude + " / longitude: " + result.native.longitude,'debug');
   log("Script Sonnenstand; sunpos: " + JSON.stringify(sunpos),'debug');
 
   altitude = Math.degrees(sunpos.altitude);
   azimuth =  Math.degrees(sunpos.azimuth) + 180;
 
   // The intensity of the direct component of sunlight throughout each day can be determined as 
   // a function of air mass. based on: http://pveducation.org/pvcdrom/properties-of-sunlight/air-mass#formula
   var airmass = 1/Math.cos((90-altitude)*4*Math.asin(1)/360); 
 
   // Sincident is the intensity on a plane perpendicular to the sun's rays in units of kW/m2 and AM is the air mass.
   // The value of 1.353 kW/m2 is the solar constant and the number 0.7 arises from the fact that about 70% of the radiation incident on the atmosphere is transmitted
   // to the Earth. The extra power term of 0.678 is an empirical fit to the observed data and takes into account the non-uniformities in the atmospheric layers.
   // ykuendig: use different values because of pv instead thermal panels
   var Sincident = (1.367*Math.pow(0.78,Math.pow(airmass,0.6)));
   var fraction = Math.cos(altitude*4*Math.asin(1)/360)*Math.sin(modtilt*4*Math.asin(1)/360)*Math.cos(azimuth*4*Math.asin(1)/360-modazi*4*Math.asin(1)/360)+Math.sin(altitude*4*Math.asin(1)/360)*Math.cos(modtilt*4*Math.asin(1)/360);
 
   // W/m² light intensity on the module * module's surface
   var SmoduleInt = Sincident * fraction * modsufrace * 1000;
   if(SmoduleInt<0) {
       SmoduleInt =    0;
   }
   // Module Effective in relation of the efficiency of the used panel
   var SmoduleEff = SmoduleInt * modeff;
 
   if( altitude < 0 ) {
       SmoduleInt =    0;
       SmoduleEff =    0;
       altitude =      0;
   }
 
   log("Script Sonnenstand; Erfolgreich gelaufen, Werte akzeptiert", "info");
   log("Script Sonnenstand; airmass: " + airmass,"debug");
   log("Script Sonnenstand; azimuth: " + azimuth,"debug");
   log("Script Sonnenstand; altitude: " + altitude,"debug");
   log("Script Sonnenstand; SmoduleInt: " + SmoduleInt,"debug");
   log("Script Sonnenstand; SmoduleEff: " + SmoduleEff,"debug");
 
   // Change ID to the created States
   setState('javascript.0.Solar.Sonnenstand.Elevation'/*javascript 0 Solar Sonnenstand Elevation*/,altitude.toFixed(1), true);
   setState('javascript.0.Solar.Sonnenstand.Azimut'/*javascript 0 Solar Sonnenstand Azimut*/,azimuth.toFixed(), true);
   setState('javascript.0.Solar.Sonnenstand.PanelPossible'/*javascript 0 Solar Sonnenstand PanelPossible*/, SmoduleEff.toFixed(), true);
}
 
// -> Zyklisch
 
schedule("*/10 * * * *", Sonnenstand_berechnen);
Sonnenstand_berechnen(); // bei Scriptstart
