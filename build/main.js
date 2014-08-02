(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var helpers;

helpers = {
  between: function(min, max, val) {
    while (val < min) {
      val += max - min;
    }
    while (max <= val) {
      val -= max - min;
    }
    return val;
  },
  angleToQuadrant: function(angle) {
    angle = this.between(0, 360, angle);
    if (angle < 90) {
      return 1;
    } else if (angle < 180) {
      return 2;
    } else if (angle < 270) {
      return 3;
    } else if (angle < 360) {
      return 4;
    }
  },
  to_radians: function(angle) {
    return angle * Math.PI / 180;
  },
  to_angle: function(rad) {
    return rad * 180 / Math.PI;
  },
  angle_sin: function(x) {
    return Math.sin(this.to_radians(x));
  },
  angle_cos: function(x) {
    return Math.cos(this.to_radians(x));
  },
  angle_tan: function(x) {
    return Math.tan(this.to_radians(x));
  },
  angle_atan: function(x) {
    return this.to_angle(Math.atan(x));
  },
  angle_asin: function(x) {
    return this.to_angle(Math.asin(x));
  }
};

module.exports = helpers;


},{}],2:[function(require,module,exports){
var jd;

jd = {
  get_julian_day: function(date) {
    var a, m, y;
    a = date.getUTCMonth() < 2 ? 1 : 0;
    y = date.getUTCFullYear() + 4800 - a;
    m = (date.getUTCMonth() + 1) + 12 * a - 3;
    return date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  },
  get_julian_date: function(date) {
    return this.get_julian_day(date) + (date.getUTCHours() - 12) / 24 + date.getUTCMinutes() / 1440 + date.getUTCSeconds() / 86400;
  },
  get_jdn: function(jd) {
    return jd - 2451545.0;
  }
};

module.exports = jd;


},{}],3:[function(require,module,exports){
var $, A, draw, init_canvas, update;

A = require('./sun-altitude.coffee');

$ = document.querySelector.bind(document);

init_canvas = function() {
  var canvas;
  canvas = $('#alt-graph');
  canvas.width = window.innerWidth;
  return canvas.height = 0.7 * window.innerHeight;
};

init_canvas();

draw = function(timespan, lat, long) {
  var ctx, d, i, nPts, sun_radius, tAtom, xAtom, yAtom, yOrigo, _fn, _i;
  ctx = $('#alt-graph').getContext('2d');
  ctx.canvas.width = ctx.canvas.width;
  yOrigo = Math.floor(ctx.canvas.height / 2);
  d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  sun_radius = 10;
  nPts = 120;
  tAtom = timespan / nPts;
  xAtom = timespan > 0 ? ctx.canvas.width / timespan : 0;
  yAtom = (sun_radius + ctx.canvas.height / 2) / 90;
  ctx.beginPath();
  ctx.strokeStyle = 'silver';
  ctx.lineWidth = 1;
  ctx.moveTo(0, yOrigo);
  ctx.lineTo(window.innerWidth, yOrigo);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = 'orange';
  ctx.arc(xAtom * (Date.now() - d.getTime()) / (1000 * 60 * 60), yOrigo - A.get_sun_altitude(new Date(), lat, long), sun_radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = 'orange';
  ctx.moveTo(0, yOrigo - A.get_sun_altitude(d, lat, long));
  _fn = function() {
    return ctx.lineTo(tAtom * xAtom * i, yOrigo - A.get_sun_altitude(new Date(d.getTime() + i * tAtom * 1000 * 60 * 60), lat, long));
  };
  for (i = _i = 1; 1 <= nPts ? _i <= nPts : _i >= nPts; i = 1 <= nPts ? ++_i : --_i) {
    _fn();
  }
  return ctx.stroke();
};

update = function() {
  return draw(parseInt($('#time-input').value), parseInt($('#lat-input').value), parseInt($('#long-input').value));
};

update();

$('#time-input').addEventListener('input', update);

$('#lat-input').addEventListener('input', update);

$('#long-input').addEventListener('input', update);


},{"./sun-altitude.coffee":4}],4:[function(require,module,exports){
var H, J, obj;

J = require('./julian-date.coffee');

H = require('./helpers.coffee');

obj = {
  axial_tilt: 23.439,
  get_ecliptic_long: function(l, g) {
    return l + 1.915 * H.angle_sin(g) + 0.02 * H.angle_sin(2 * g);
  },
  get_right_ascension: function(ecliptic_long) {
    return H.angle_atan(H.angle_cos(this.axial_tilt) * H.angle_tan(ecliptic_long));
  },
  get_hour_angle: function(jd, longitude, right_ascension) {
    return H.between(0, 360, this.get_gst(jd) + longitude - right_ascension);
  },
  get_declination: function(ecliptic_long) {
    return H.angle_asin(H.angle_sin(this.axial_tilt) * H.angle_sin(ecliptic_long));
  },
  get_sun_altitude: function(date, latitude, longitude) {
    var dec, ec_long, g, ha, jd, jdn, l, r_asc;
    jd = J.get_julian_date(date);
    jdn = J.get_jdn(jd);
    l = H.between(0, 360, 280.460 + 0.9856474 * jdn);
    g = H.between(0, 360, 357.528 + 0.9856003 * jdn);
    ec_long = this.get_ecliptic_long(l, g);
    r_asc = this.get_right_ascension(ec_long);
    while (H.angleToQuadrant(ec_long) !== H.angleToQuadrant(r_asc)) {
      r_asc += r_asc < ec_long ? 90 : -90;
    }
    dec = this.get_declination(ec_long);
    ha = this.get_hour_angle(jd, longitude, r_asc);
    return H.angle_asin(H.angle_sin(latitude) * H.angle_sin(dec) + H.angle_cos(latitude) * H.angle_cos(dec) * H.angle_cos(ha));
  },
  get_last_jd_midnight: function(jd) {
    if (jd >= Math.floor(jd + 0.5)) {
      return Math.floor(jd - 1) + 0.5;
    } else {
      return Math.floor(jd) + 0.5;
    }
  },
  get_ut_hours: function(jd, last_jd_midnight) {
    return 24 * (jd - last_jd_midnight);
  },
  get_gst_hours: function(jdn_midnight, ut_hours) {
    var gmst;
    gmst = 6.697374558 + 0.06570982441908 * jdn_midnight + 1.00273790935 * ut_hours;
    return H.between(0, 24, gmst);
  },
  get_gst: function(jd) {
    var jdm;
    jdm = this.get_last_jd_midnight(jd);
    return 15 * this.get_gst_hours(J.get_jdn(jdm), this.get_ut_hours(jd, jdm));
  }
};

module.exports = obj;


},{"./helpers.coffee":1,"./julian-date.coffee":2}]},{},[3])