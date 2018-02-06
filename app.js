	var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-depfix");
    var nodemailer = require('nodemailer');
    var mongoose=require('mongoose');
    var Student = require('./studentdata.js');


    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    /** API path that will upload the files */
    mongoose.connect('mongodb://localhost/excel-to-json-in-Node', function (err) {
    app.post('/upload', function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    
                   
                    var emailOfStudent=[];
                    Object.keys(result).map(function(value,index){
                        emailOfStudent.push(result[value]['email-id']);
                    });
                    console.log(emailOfStudent);
                    var samstudent = new Student({
                        _id: new mongoose.Types.ObjectId(),
                        email:emailOfStudent,
                    });
                    samstudent.save(function(err) {
                      if (err) throw err;
                     console.log('student successfully saved.');
                    })
                
                    var emails=emailOfStudent.join();
                    var transporter = nodemailer.createTransport({
                         service: 'gmail',
                        auth: {
                            user: 'aashukumari1289@gmail.com',//your email address
                            pass: 'qwedfgvbn'//your password
                            }
                         });

                    var mailOptions = {
                       from: 'anshusingh26026@gmail.com',
                       to:emails,
                       subject: 'Sending Email using Node.js',
                       text: req.body.msg
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                     res.json({msg:"mail sent successfully", data: emailOfStudent});
                      }
                    });
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
       
    });
	
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});
});

    app.listen('3000', function(){
        console.log('running on 3000...');
    });