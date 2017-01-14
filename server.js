var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , Twit = require('twit')
  , mongoose = require('mongoose')
  , io = require('socket.io').listen(server)
  , streamHandler = require('./utils/streamHandler')
  , config = require('./config/config.js')
  , bodyParser = require('body-parser')
  , assert = require('assert');

var Tweet = require('./models/Tweet');
const util = require('util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

server.listen(process.env.npm_package_config_port);
console.log("Server Started for watchList:"+process.env.npm_package_config_watchList+", storageName:"+process.env.npm_package_config_storageName+", watchIndex:"+process.env.npm_package_config_watchIndex)
app.use(express.static(__dirname + '/public'));
//app.use('/static', express.static('public'));
// Connect to our mongo database
mongoose.connect('mongodb://localhost:27017/pcln_twitter_feed');



var watchList = [process.env.npm_package_config_watchList];

 var T = new Twit(config)

io.sockets.on('connection', function (socket) {
  console.log('Connected');


 var stream = T.stream('statuses/filter', { track: watchList })

 streamHandler(stream,io, process.env.npm_package_config_watchIndex);




 app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});


app.get("/search", function(req, res) {
  res.sendfile(__dirname + '/public/views/search.html');
});

app.post("/search", function(req, res) {
  //console.log("Search Text: "+req.body.searchtext);
  //console.log(util.inspect(req.body, false, null))
  Tweet.getTweets(req.body.searchtext,req.params.page, req.params.skip, function(tweets) {

      // Render as JSON
      res.send(tweets);

    });
});


app.get("/add", function(req, res) {
  res.sendfile('/public/views/add.html');
});

app.post("/add", function(req, res) {
  db.collection('textstore').insert({
    document: req.body.newDocument,
    created: new Date()
  }, function(err, result) {
    if (err == null) {
      res.sendfile("/public/views/add.html");
    } else {
      res.send("Error:" + err);
    }
  });
});


function pagelist(items) {
  result = "<html><body><ul>";
  items.forEach(function(tweet) {
    console.log(tweet);
    itemstring = "<li><div class=\"timeline-badge danger\"><i class=\"glyphicon glyphicon-thumbs-up\"></i></div><div class=\"timeline-panel\" style=\"background-color:white;color:black\"><div class=\"timeline-heading\"><h4 class=\"timeline-title\">"+tweet.author+"</h4><img src='"+tweet.avatar+"'><p><small class=\"text-muted\"><i class=\"glyphicon glyphicon-time\"></i> Just Now via Twitter</small></p></div><div class=\"timeline-body\"> "+tweet.body+"</div></div></li>";
    result = result + itemstring;
  });
  result = result + "</ul></body></html>";
  return result;
}

 });