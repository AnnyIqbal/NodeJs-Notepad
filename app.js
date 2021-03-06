var cool = require('cool-ascii-faces');
var http = require('http');
var fs = require('fs');

var filename;
function extractFilenameAndData(url) {
    var queryString = url ? url.split('?') : 'null'; // text='hello+world'&saveas='abc'
    var arr = queryString[1] ? queryString[1].split('&') : 'null'; 
    arr[0] = arr[0].split('+').toString().replace(/,/g, ' ');
    for(let i = 0; i < arr.length; i++) {
       arr[i] = arr[i].split('=')[1];
    }
    // console.log('arr: ', arr);
    filename = arr[1];
    return arr;
}

function myfunc(res, data) {
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                res.writeHead(202, {'Content-Type': 'download'});
                fs.readFile(`${filename}`, 'utf8', function(err, data) {
                    if(err) throw err;
                    console.log(data);
                    res.end(data); 
                });
}

var server = http.createServer(function (req, res) {
    if(req.url !== '/favicon.ico' && req.url === '/') {
        fs.readFile('notepad.html', 'utf8', function(err, data) { // notepad rendered
            if(err) throw err;
            res.writeHead(202, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
    else if(req.url !== '/favicon.ico' && req.url.startsWith('/save')) {  
        var arr = [];
        arr = extractFilenameAndData(req.url);
        fs.writeFile(arr[1], arr[0], function(err){});
        fs.readFile('saved.html', 'utf8', function(err, data) {
            // res.write(`<h1> File \'${arr[1]}\' Saved! </h1> <br><br> ${data}`, 'utf8', function(res, data){});
            res.end(`<h1> File \'${arr[1]}\' Saved! </h1> <br><br> ${data}`);
        });
    }
    else if(req.url !== '/favicon.ico' && req.url.startsWith('/download')) {  
       res.setHeader('Content-disposition', `attachment; filename=${filename}`);
       res.writeHead(202, {'Content-Type': 'download'});
       fs.readFile(`${filename}`, 'utf8', function(err, data) {
           if(err) throw err;
           console.log(data);
           res.end(data); 
        //    Alternatively
        //    res.write(data);
        //    res.end();
       });
    }
    else if(req.url !== '/favicon.ico' && req.url.startsWith('/upload')) {
        var queryString = req.url ? req.url.split('?') : 'null';
        var upload = queryString[1].split('=');
        var done = upload[1].split('+').toString().replace(/,/g, ' ');
        fs.readFile(done, 'utf8', function(err, data) {
            // if(err) throw err;
            res.end(`<h1> File \'${done}\' Uploaded! </h1><h3> ${done} </h3><p> ${data} </p>`);
        });
    }
    else if(req.url !== '/favicon.ico' && req.url === '/cool') {
            res.end(cool());
    }
});

server.listen(process.env.PORT || 3000); // heroku server port || local host port 
console.log('server is running on port 3000');
