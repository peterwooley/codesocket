var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app);

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
    res.render('index.jade', {program: req.params.rc || ""});
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

