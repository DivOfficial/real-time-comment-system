function dbConnect() {
     // Db connection
     const mongoose = require('mongoose');
     // const url = "mongodb+srv://divyansh:iamdiv8534@cluster0.wrcb3.mongodb.net/rtcs?retryWrites=true&w=majority"
     const url = "mongodb://localhost/comments"

     mongoose.connect(url,
          {
               useNewUrlParser: true,
               useUnifiedTopology: true
          }
     );

     const db = mongoose.connection;
     db.on("error", console.error.bind(console, "connection error: "));
     db.once("open", function () {
          console.log("Connected successfully");
     });

}

module.exports = dbConnect;