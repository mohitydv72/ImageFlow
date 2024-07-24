const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/instagram') ;
mongoose.connect(process.env.MONGOURL).then(()=>{
  // console.log('Connected to DB');
}
).catch((err)=>{
  console.log('Error' , err);
}
);

const postSchema =  new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  image:{
    type:String
  },
  imageMimeType: {
    type: String
  },
  user:{
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'User'
  } ,
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  },
  
});

module.exports = mongoose.model('Post', postSchema);

