var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/locatie';
// mongo in nodeJs: http://mongodb.github.io/node-mongodb-native/2.2/
// mongo API : http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

MongoClient.connect(url, function(error, db){
    if (error)
        throw new Error(error);
    console.log("Connected succesfully to server");
    db.close();
});
//met behulp van code van jeroen en Yannick
var dalKassa = {
    connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
    clearKassa: function(call){
        this.connect(null, function(db){
            db.collection('kassa').drop(function(err, result){
                db.close();
                });
         });
        },

    listAllKassa: function (kassaCallback) {
        this.connect(null, function(db){
            db.collection('kassa').find({}).toArray(function(err, result){
                db.close();
                kassaCallback(result);
                });
            });
        },
        //met behulp van code Yannick
      findKassa: function(kassaCallback, id){
          this.connect(null, function(db){
              db.collection('kassa').find({kassa_id:id}).toArray(function(err,result){
                  db.close();
                  kassaCallback(result);
              });
          });
      },
      createKassa: function(kassa, callback){
          this.connect(null, function(db){
              db.collection('kassa').insert(kassa, function(err, result){
                  db.close();
                  callback();
              });
          });
      },
   
    updatePauze: function (id, update) {               //update = PUT
        this.connect(null, function(db){
            db.collection('kassa').update({kassa_id : id},
            { $set : update});
        });
      }
};
 
module.exports = dalKassa;


