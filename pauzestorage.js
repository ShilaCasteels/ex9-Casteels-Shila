var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/pauze';
// mongo in nodeJs: http://mongodb.github.io/node-mongodb-native/2.2/
// mongo API : http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

MongoClient.connect(url, function(error, db){
    if (error)
        throw new Error(error);
    console.log("Connected succesfully to server");
    db.close();
});
//met behulp van code van jeroen en Yannick
var dalPauze = {
    connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
    clearPauze: function(call){
        this.connect(null, function(db){
            db.collection('pauze').drop(function(err, result){
                db.close();
                });
         });
        },

    listAllPauze: function (pauzeCallback) {
        this.connect(null, function(db){
            db.collection('pauze').find({}).toArray(function(err, result){
                db.close();
                pauzeCallback(result);
                });
            });
        },
        //met behulp van code Yannick
      findPauze: function(pauzeCallback, id){
          this.connect(null, function(db){
              db.collection('pauze').find({pauze_id:id}).toArray(function(err,result){
                  db.close();
                  pauzeCallback(result);
              });
          });
      },
      createPauze: function(pauze, callback){
          this.connect(null, function(db){
              db.collection('pauze').insert(pauze, function(err, result){
                  db.close();
                  callback();
              });
          });
      },
   
    updatePauze: function (id, update) {               //update = PUT
        this.connect(null, function(db){
            db.collection('pauze').update({pauze_id : id},
            { $set : update});
        });
      }
};
 
module.exports = dalPauze;

