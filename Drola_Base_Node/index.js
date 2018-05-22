var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
app.use(cookieParser());
app.use(bodyParser.json());

var router = express.Router();
var path = __dirname + '/';

router.use(function (req,res,next) {
    next();
});

router.get("/",function(req,res){
    res.sendFile(path + "web/index.html");
});

app.use("/",router);
app.use("/css",express.static('web/css'));
app.use("/js",express.static('web/js'));
app.use("/images",express.static('web/images'));
app.use("/fonts",express.static('web/fonts'));


app.listen(3000,function(){
    console.log("Communicaton link, Live at Port 3000");
});
