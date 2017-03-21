var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile('notepad.html', 'utf8', function(err, data) { // notepad rendered
       if(err) throw err;
       res.writeHead(202, {'Content-Type': 'text/html'});
       res.end(data);
    });
    if(req.url !== '/favicon.ico' && req.url !== '/') {  
        var queryString = req.url ? req.url.split('?') : 'null'; // text='hello+world'&saveas='abc'
        var arr = queryString[1] ? queryString[1].split('&') : 'null'; 
        arr[0] = arr[0].split('+').toString().replace(/,/g, ' ');
        for(let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split('=')[1];
        }
        console.log('arr: ', arr);
        fs.writeFile(arr[1], arr[0], function(err){});
        res.end(`<h1> File \'${arr[1]}\' Saved! </h1>`);
    }
});

server.listen(3000);
console.log('server is running on port 3000');
