const multer= require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const storage = multer.diskStorage({
//     destination: (req , file , cb) => {
//         cb(null , './public/images/uploads');
//     } ,
//     filename: (req, file, cb) => {
//         const uniqueName = uuidv4();
//         cb(null, uuidv4() + path.extname(file.originalname));
//     }
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
module.exports = upload;
