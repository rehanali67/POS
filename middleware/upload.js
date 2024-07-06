const multer= require("multer");
const path=require('path');

const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`);
    }
});
const fileFilter=(req,file,cb)=>{
    const allowedTypes=['image/jpg','image/png','image/png'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:1024*1024*5
    }
})
module.exports=upload;