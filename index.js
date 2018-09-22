const Promise = require('bluebird'),
	  fs      = Promise.promisifyAll(  require('fs')  );
      ase     = require('ase-util'),
	  Color   = require('color');


fs.readFileAsync('./swatches.ase')
.then(function(buf) {
	var result  = ase.read(buf),
	    entries = result[0].entries;


	var swatches = [];

	for(var entry of entries) {
		var color = false;

		if(entry.color.model === 'RGB') {
			var color_rgb = [ entry.color.r, entry.color.g, entry.color.b ]
			                .map(function(v){return(v*255)});
			color = Color.rgb(color_rgb);
		} else if(entry.color.model === 'LAB') {
			var color_lab = [ (entry.color.lightness*100), entry.color.a, entry.color.b ];
			color = Color.lab(color_lab);
		} else if(entry.color.model === 'CMYK') {
			color = Color.cmyk([ entry.color.c, entry.color.m, entry.color.y, entry.color.k ])
			        .map(function(v){return(v*255)});
		}

		if(color !== false)
			swatches.push({ name: entry.name, color: color });
	}


	var strVariables = [];

	for(var swatch of swatches) {
		var strName = sanitizeCssVariableName(swatch.name),
		    strRgb  = swatch.color.string(),

		    strVariable = '$' + strName + ': ' + strRgb + ';' + "\n";
		strVariables.push(strVariable);
	}

	var output = strVariables.join('');
	console.log(output);
});


function sanitizeCssVariableName(str) {
	return str.toLowerCase().replace(/ /g, '-');
}
