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
//met behulp van code van wibren en peter
var dalLocatie = {
    connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
    clearLocatie: function(call){
        this.connect(null, function(db){
            db.collection('locatie').drop(function(err, result){
                db.close();
                });
         });
        },

    listAllLocaties: function (locatieCallback) {
        this.connect(null, function(db){
            db.collection('locatie').find({}).toArray(function(err, result){
                locatie = result;
                db.close();
                locatieCallback(locatie);
                });
            });
        },
        //met behulp van code Yannick
      findLocaties: function(locatieCallback, id){
          this.connect(null, function(db){
              db.collection('locatie').find({_id:id}).toArray(function(err,doc){
                  locatie = doc;
                  db.close();
                  locatieCallback(locatie);
              });
          });
      },
      createLocatie: function(locatieCreatie){
          this.connect(null, function(db){
              db.collection('locatie').insert(locatie, function(err, result){
                  locatie = result;
                  db.close();
                  locatieCreatie(locatie);
              });
          });
      },
   
    updateLocatie: function (id, update) {               //update = PUT
        this.connect(null, function(db){
            db.collection('locatie').update({_id : id},
            { $set : update});
        });
      }
};
 
module.exports = dalLocatie;