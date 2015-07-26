var fs = require('fs')
fs.readFile('node_modules/freeboard/index.html' , 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace('head.js("js/freeboard+plugins.min.js",', 'head.js("js/freeboard+plugins.min.js", "../freeboard_api/datasources",');

  fs.writeFile('node_modules/freeboard/index.html', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});