const mongoose=require('mongoose');
const mongo_uri =process.env.MONGO_CONN;
mongoose.connect(mongo_uri,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Mongodb Connected...');
    })
    .catch((err)=>{
        console.log('MongoDB Connection Error: ',err);
    })