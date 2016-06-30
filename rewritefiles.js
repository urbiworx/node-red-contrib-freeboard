var fs = require('fs')

var head=
  'head.js("js/freeboard.js","js/freeboard.plugins.min.js", "../freeboard_api/datasources", "plugins/thirdparty/jquery.keyframes.min.js", "plugins/thirdparty/widget.ragIndicator.js",\n'+
  'function(){'+
  '                  $(function()\n'+
  '                  { //DOM Ready\n'+
  '                      freeboard.initialize(true);\n'+
  '                      var hash = window.location.hash;\n'+
  '                      if (hash !== null) {\n'+
  '                          $.get("/freeboard_api/dashboard/"+hash.substring(1), function(data) {\n'+
  '							var datap=JSON.parse(data);\n'+
  '							if (!datap.empty){\n'+
  '								freeboard.loadDashboard(datap, function() {\n'+
  '									freeboard.setEditing(false);\n'+
  '									});\n'+
  '								}\n'+
  '	                        });\n'+
  '	                     }\n'+
  '	                 });\n'+
  '	            });\n'+
  '	</script>';

fs.readFile('node_modules/freeboard/index.html' , 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/head.js[\s\S]*?<\/script>/g, head);
  fs.writeFile('node_modules/freeboard/index.html', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});

var saveDashboard=
	'this.saveDashboard = function(_thisref, event)\n'+
	'{\n'+
	'	var pretty = $(event.currentTarget).data("pretty");\n'+
	'	var hash=window.location.hash;\n'+
	'	if (typeof(hash)=="undefined"||hash==null||hash==""){\n'+
	'		hash="start-"+Math.floor(Math.random()*99999);\n'+
	'		window.location.hash=hash;\n'+
	'	} else {\n'+
	'		hash=hash.substring(1);\n'+
	'	}\n'+
	'	var contentType = "application/octet-stream";\n'+
	'	var a = document.createElement("a");\n'+
	'	$.ajax({\n'+
	'		type:"POST",\n'+
	'		url:"../freeboard_api/dashboard",\n'+
	'		data:{\n'+
	'			content:pretty?JSON.stringify(self.serialize(), null, "\t"):JSON.stringify(self.serialize()),\n'+
	'			name:hash\n'+
	'		}\n'+
	'	}).done(function(){\n'+
	'		new DialogBox("Dashboard is saved, make sure to bookmark the URL.", "Info", "OK");\n'+
	'	});\n'+
	'}\n';

fs.readFile('node_modules/freeboard/js/freeboard.js' , 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/this\.saveDashboard =[\s\S]*?a\.click[\s\S]*?\}/g, saveDashboard);
  fs.writeFile('node_modules/freeboard/js/freeboard.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});

// Copy the plugins across
fs.createReadStream('freeboard-widget-rag-files/jquery.keyframes.min.js').pipe(fs.createWriteStream('node_modules/freeboard/plugins/thirdparty/jquery.keyframes.min.js'));
fs.createReadStream('freeboard-widget-rag-files/widget.ragIndicator.js').pipe(fs.createWriteStream('node_modules/freeboard/plugins/thirdparty/widget.ragIndicator.js'));