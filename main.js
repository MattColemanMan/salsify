var express = require('express');
var app = express();


var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(process.argv[2]);

var dict = new Array(); //our datastore for each line
var lock = 7; //set to -1 when we're done processing the file


lr.on('line', function (line) { //store everything in the datastore
	dict.push(line);
});

lr.on('end', function () { // All lines are read, file is closed now
	lock = -1;
});

lr.on('error', function (err) { //error handling
	res.status(500).send('HTTP ERROR 500: Source file contains errors');
});




app.get('/lines/:line', function (req, res) { //define our api call
	if(req.params.line > dict.length){ //requesting a line we can't reach
		if(lock == -1){ //a line we can't reach and wont
			res.status(413).send('HTTP ERROR 413: Line number does not exist, our file is not that big');
			res.end();
		}else{ //for very large files, let them know we're still setting up
			res.status(413).send("HTTP ERROR 413: Server hasn't finished setting up, please try again later");
			res.end();
		}
	}
	res.status(200).send( dict[req.params.line - 1]); //-1 because arrays are 0 indexed
});



var server = app.listen(8081, function () { //start off the server
	var host = server.address().address
	var port = server.address().port
	console.log("Line Reader App running at http://%s:%s", host, port)
});