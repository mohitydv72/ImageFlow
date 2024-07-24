const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
let plm = require('passport-local-mongoose');
configDotenv();

// mongoose.connect('mongodb://localhost:27017/instagram') ;
mongoose.connect(process.env.MONGOURL).then(()=>{
  // console.log('Connected to DB');
}
).catch((err)=>{
  console.log('Error' , err);
}
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  // ...

    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
  dp: String, // Profile picture
  dpMimeType: String, // MIME type of the profile picture
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: { 
    type: String,
    required: true
  }
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);
