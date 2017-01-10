var Tweet = require('../models/Tweet');

module.exports = function(stream, io, exp_id){
  //console.log("exp_id:"+exp_id);
  // When tweets get sent our way ...
 stream.on('tweet', function (tweet) {
      console.log(tweet);

     if (tweet['user'] !== undefined) {

      // Construct a new tweet object
      var tweetObj = {
        expId : exp_id,
        twid  : tweet['id_str'],
        active: false,
        author: tweet['user']['name'],
        avatar: tweet['user']['profile_image_url'],
        body  : tweet['text'],
        date  : tweet['created_at'],
        screenname: tweet['user']['screen_name']
      };

      // Create a new model instance with our object
      var tweetEntry = new Tweet(tweetObj, exp_id);
      // Save 'er to the database
      tweetEntry.save(function(err) {
        if (!err) {
          // If everything is cool, socket.io emits the tweet.
          //io.emit('tweet', tweet);
          io.sockets.emit('stream',tweet);
        }
      });

    }
    //io.sockets.emit('stream',tweet);

  });

};
