var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app)
    argv = require('optimist').argv,
    dir = process.cwd();

app.configure(function() {
    app.use(express.bodyParser({ keepExtensions: true }));
    app.use(express.compress())
    app.use(express.static('./public', { maxAge: 31557600000/*One Year*/ }));
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
});


app.get('/:rc?', function(req, res){
    res.render('index.jade', {
        files: fs.readdirSync(process.cwd() ).map(function(file) {
            if(!fs.statSync(process.cwd()+'/'+file).isDirectory())
                return file;
        }),
        title: process.cwd().split('/').slice(-1)[0],
        program: req.params.rc || ""
    });
});

app.get('/open/:file', function(req, res) {
    res.send(fs.readFileSync(dir + '/' + req.params.file));
});

app.post('/save', function(req, res) {
    if(req.body.file && req.body.contents) {
        fs.writeFileSync(dir + "/" + req.body.file, req.body.contents);
        res.send("File saved.");
    } else {
        res.send("File not saved.");
    }
});

rc = {}
rc.programs = io.of('/program')
rc.flynn = io
    .of('/flynn')
    .on('connection', function(socket) {
        socket.on('command', function(command) {
            rc.programs.emit('command', command);
        })
    });

app.listen(3000);

