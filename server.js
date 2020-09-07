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
        // console.log(file);
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
            const truyentranh = new TruyenTranh({
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
                   res.redirect('./list');
                }
            });
        }

    });
});


//Danh sach
app.get('/list', function(req, res){
    TruyenTranh.find(function(err, data){
        if(err){
            res.json({
                status: "error",
                message: "error"
            }); 
        }else{
            res.render('list', {danhsach: data});
        }
    });
});


//Edit
//lay thong tin chi tiet cua :id
app.get('/edit/:id', function(req, res){
    TruyenTranh.findById(req.params.id, function(err, data){
        if(err){
            res.json({
                status: "error",
                message: "error"
            }); 
        }else{
            // console.log(data);
            res.render('edit', {danhsach: data});
        }
    });
     
});

app.post('/edit', function(req, res){
    //xu ly upload file (check khach hang co chon file moi khong)

   
    upload(req, res, function (err) {

         // Khong Co chon file moi
        if(!req.file){
            TruyenTranh.updateOne({_id: req.body.idDanhSach}, {
                name: req.body.ten,
                date_pub: req.body.ngayxb
            },function(err){
                if(err){
                    res.json({
                        status: "error",
                        message: "error"
                    });
                }else{
                    res.redirect('./list');
                }
            }); 
        }else{

            // Co chon file moi
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
              TruyenTranh.updateOne({_id: req.body.idDanhSach}, {
                  name: req.body.ten,
                  image: req.file.filename,
                  date_pub: req.body.ngayxb
              },function(err){
                  if(err){
                      res.json({
                          status: "error",
                          message: "error"
                      });
                  }else{
                      res.redirect('./list');
                  }
              }); 
            }
        }
    });
});


app.get('/delete/:id', function(req, res){
    TruyenTranh.deleteOne({_id:req.params.id}, function(err){
        if(err){
            res.json({
                status: "error",
                message: "error"
            });
        }else{
            res.redirect('../list');
        }
    });
});

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
