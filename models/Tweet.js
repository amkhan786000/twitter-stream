var mongoose = require('mongoose');

var expId=null;
// Create a new schema for our tweet data
var schema = new mongoose.Schema({
     expId     : String 
  ,  twid      : String
  , active     : Boolean
  , author     : String
  , avatar     : String
  , body       : String
  , date       : Date
  , screenname : String
});

function Tweet(tweetObj, expId){
  console.log("ExpId:"+expId);
  this.expId=expId;
  console.log("ExpId:"+expId);
}

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(txtSearch,page, skip, callback) {
  var tweets = [],
      start = (page * 10) + (skip * 1);
console.log(txtSearch);
  // Query the db, using skip and limit to achieve page chunks
  Tweet.find({body: new RegExp(txtSearch, 'i')} ,'body date',{skip: start, limit: 100}).sort({date: 'desc'}).exec(function(err,docs){

 if(err) {
  console.log(err);
 }
    // If everything is cool...
    if(!err) {
      tweets = docs;  // We got tweets
      tweets.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }

    // Pass them back to the specified callback
    callback(tweets);

  });

};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model(process.env.npm_package_config_storageName, schema);


//var schemaModal=mongoose.model('Tweet', schema);

// module.exports = function(tweetObj,expId){
//   mongoose.model('Tweet'+expId, schema);

// };