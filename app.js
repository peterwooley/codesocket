var express = require('express'),
    app = express.createServer();

app.configure(function() {
    app.use(express.bodyParser({ keepExtensions: true }));
    app.use(express.compress())
    app.use(express.static('./public', { maxAge: 31557600000/*One Year*/ }));
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
});


app.get('/', function(req, res){
    res.render('index.jade');
});

app.listen(3000);

