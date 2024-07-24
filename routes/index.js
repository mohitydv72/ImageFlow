var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const base64Image = req.file.buffer.toString('base64');
  const mimeType = req.file.mimetype;

  let user = await userModel.findOne({
    username: req.session.passport.user
  });

  const postData = await postModel.create({
    postText: req.body.filecaption,
    image: base64Image,
    imageMimeType: mimeType,
    user: user._id
  });

  user.posts.push(postData._id);
  await user.save();
  res.redirect("/profile");
});

// router.post('/upload', isLoggedIn, upload.single('file') , async (req,res) =>{
//   if(!req.file){
//     return res.status(400).send("No file uploaded");
//   }
//   let user = await userModel.findOne({
//     username : req.session.passport.user
//   })
//   const postData = await  postModel.create({
//     postText : req.body.filecaption,
//     image : req.file.filename,
//     user : user._id
//   });

//    user.posts.push(postData._id);
//   await user.save();
//   res.redirect("/profile");

// });

// router.post('/profileupload', isLoggedIn, upload.single('image') , async (req,res) =>{
//   // if(!req.image){
//   //   return res.status(400).send("No image uploaded");
//   // }
//   let user = await userModel.findOne({
//     username : req.session.passport.user
//   })
//   user.dp = req.file.filename;
  
//   await user.save();
//   res.redirect("/profile");

// });
router.post('/profileupload', isLoggedIn, upload.single('image'), async (req, res) => {
  // if (!req.file) {
  //   return res.status(400).send("No image uploaded");
  // }

  const base64Image = req.file.buffer.toString('base64');
  const mimeType = req.file.mimetype;

  let user = await userModel.findOne({
    username: req.session.passport.user
  });

  user.dp = base64Image;
  user.dpMimeType = mimeType; // Save MIME type in the database

  await user.save();
  res.redirect("/profile");
});

router.get('/login', function(req, res, next) {
  res.render('login' , {error : req.flash('error')});
  // console.log(req.flash('error'));
});
// router.get('/feed', function(req, res, next) {
//   res.render('feed');
// });

router.get('/feed', isLoggedIn  , async function(req, res, next) {
  let user = await userModel.findOne({
    username : req.session.passport.user
  })
  let posts = await postModel.find().populate('user');
  // console.log(posts);
  res.render('feed' , {  user , posts});

});


router.get('/profile', isLoggedIn  , async function(req, res, next) {
  let user = await userModel.findOne({
    username : req.session.passport.user
  }).populate('posts');
  // console.log(user);
   res.render('profile' , {user});
});



router.post('/register' , async (req,res) =>{
    const userData = new userModel({
        username : req.body.username,
        email : req.body.email,
        fullName : req.body.fullName
    });
    await userModel.register(userData , req.body.password).then(()=>{
      passport.authenticate('local')(req,res,()=>{
        res.redirect('/profile');
      } )
    })
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login' ,
  failureFlash: true

} ) , async (req,res) =>{
});

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// router.get('/alluser', async function(req, res, next) {
//     let users = await userModel.findOne({_id : "65eaa29272a0771b04778078"}).populate('posts');
//     res.send(users);
// });
// router.get('/createuser', async function(req, res, next) {
//   let createdUser = await userModel.create({
//     username : "mridul",
//     password : "soni",
//     posts : [],
//     email : "soni@gmail.com",
//     fullName : "mridul soni",
//   })
//   res.send(createdUser);
// });
// router.get('/createpost', async function(req, res, next) {
//   let createdPost = await postModel.create({
//     postText : "hello world",
//     user :"65eaa29272a0771b04778078"
  
//   })
//   let user = await userModel.findOne({_id : "65eaa29272a0771b04778078"});
//   user.posts.push(createdPost._id);
//   await user.save();
//   res.send("Done");
// });

module.exports = router;
