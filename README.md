#sun-altitude.js

Calculate the altitude of the sun given date/time and geolocation.

###USAGE

```
S = require('sun-altitude.js');
S.get_sun_altitude(date, latitude, longitude);
```
where date is any date object like ```var date = new Date()``` and latitude positive eastward as given by ```navigation.geolocation```.
