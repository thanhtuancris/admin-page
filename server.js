const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');


//connect DB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin-page', {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if(err) {
        console.log('Error connecting' + err);
    }else{
        console.log('Connected to MongoDB');
    }
});


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//multer
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("anhTruyenTranh");


//port
const port = process.env.PORT || 3000;

//Models
const TruyenTranh = require('./Models/truyentranh');

//routes
app.get('/add', (req, res) => {
    res.render("add");
});

app.post('/add', (req, res) => {
    //Upload file
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json({
              status: "error",
              message: "error"
          }); 
        } else if (err) {
            res.json({
                status: "error",
                message: "error"
            }); 
        }else{
            //save MongoDB
            const truyentranh = TruyenTranh({
                name: req.body.ten,
                image: req.file.filename,
                date_pub: req.body.ngayxb
            });
            truyentranh.save((err) => {
                if(err){
                    res.json({
                        status: "error",
                        message: "error"
                    }); 
                }else{
                    res.json({
                        status: "success",
                        message: "success"
                    }); 
                }
            });
        }

    });
});



app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
