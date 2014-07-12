var express = require('express');

var app =  express();
;
//MySql
var mysql      = require('mysql');
var path = require('path');
var moment = require('moment');
var visitors=1;
var connection;



function handleDisconnect() {
     connection = mysql.createConnection({
        database: 'vegdb',
        host     : '',
        user     : '',
        password : ''
    });

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();


app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res){
    connection.query('SELECT * FROM vegprices', function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        connection.query("SELECT * FROM vegprices WHERE Date IN (SELECT max(Date) FROM vegprices) ORDER BY 'vegcode' ASC", function selectCb(err2, results2, fields2) {
            if (err) {
                throw err;
            }
            connection.query('SELECT * FROM vegcode', function selectCb(err3, results3, fields3) {
                if (err) {
                    throw err;
                }
                var sortedFruit = new Array();
                for (var i=0; i<100; i++) {
                    sortedFruit[i] = new Array();
                }
                for (var i = 0; i < results.length; i++) {
                    sortedFruit[results[i].VegCode].push(results[i]);
                }
                var fruitLabels = new Array();

                for (var i=0; i<results3.length; i++) {
                    fruitLabels.push(results3[i].HebrewName);
                }
                console.log('new visitor: no. ' + visitors);
                visitors++;
                res.render('index', {
                    //results: results,
                    latest: results2,
                    labels:fruitLabels,
                    sorted: sortedFruit,
                    letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
                    moment: moment
                });
            });
        });

    });

});

app.get('/en', function(req, res){
    connection.query('SELECT * FROM vegprices', function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        connection.query("SELECT * FROM vegprices WHERE Date IN (SELECT max(Date) FROM vegprices) ORDER BY 'vegcode' ASC", function selectCb(err2, results2, fields2) {
            if (err) {
                throw err;
            }
            connection.query('SELECT * FROM vegcode', function selectCb(err3, results3, fields3) {
                if (err) {
                    throw err;
                }
                var sortedFruit = new Array();
                for (var i=0; i<100; i++) {
                    sortedFruit[i] = new Array();
                }
                for (var i = 0; i < results.length; i++) {
                    sortedFruit[results[i].VegCode].push(results[i]);
                }
                var fruitLabels = new Array();

                for (var i=0; i<results3.length; i++) {
                    fruitLabels.push(results3[i].EnglishName);
                }
                console.log('new visitor: no. ' + visitors);
                visitors++;
                res.render('index', {
                    results: results,
                    latest: results2,
                    labels:fruitLabels,
                    sorted: sortedFruit,
                    letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
                    moment: moment
                });
            });
        });

    });
});

app.get('/ar', function(req, res){
    connection.query('SELECT * FROM vegprices', function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        connection.query("SELECT * FROM vegprices WHERE Date IN (SELECT max(Date) FROM vegprices) ORDER BY 'vegcode' ASC", function selectCb(err2, results2, fields2) {
            if (err) {
                throw err;
            }
            connection.query('SELECT * FROM vegcode', function selectCb(err3, results3, fields3) {
                if (err) {
                    throw err;
                }
                var sortedFruit = new Array();
                for (var i=0; i<100; i++) {
                    sortedFruit[i] = new Array();
                }
                for (var i = 0; i < results.length; i++) {
                    sortedFruit[results[i].VegCode].push(results[i]);
                }
                var fruitLabels = new Array();

                for (var i=0; i<results3.length; i++) {
                    fruitLabels.push(results3[i].ArabicName);
                }
                console.log('new visitor: no. ' + visitors);
                visitors++;
                res.render('index', {
                    results: results,
                    latest: results2,
                    labels:fruitLabels,
                    sorted: sortedFruit,
                    moment: moment
                });
            });
        });

    });
});

app.listen(80);
console.log("Express server listening");