var http = require('http');
var fs = require('fs');
var events = require('events'); // requiring the core module
var saveFile = new events.EventEmitter();

var server = http.createServer(function (req, res) {
    fs.readFile('notepad.html', 'utf8', function(err, data){
      if(err) throw err;
        res.writeHead(202, {'Content-Type': 'text/html'});
        res.end(data);
    });
    if(req.url === '/save') {
   var jsonString = '';

        req.on('data', function (data) {
                console.log('data', data);
            jsonString += data;
        });

        req.on('end', function () {
            console.log(jsonString);
        });


        //     console.log(req.body);
        // saveFile.on('click', function(msg){ // set event jb 'someEvent occur ho tb call this callback function
        //     console.log(msg);
        // });
        // saveFile.emit('click', 'some text'); // manually emitting the Event
        // // fs.writeFile('newFile.txt', 'utf8', function(err){});
        res.end('saved');
    }
});

server.listen(3000);
console.log('server is running on port 3000');
