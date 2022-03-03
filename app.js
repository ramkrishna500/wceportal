const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose")

// const md5=require("md5");

const session=require("express-session")
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose")

const app=express();


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session())

// for student
mongoose.connect("mongodb://localhost:27017/studentDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema)


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
})
app.get("/student-home",function(req,res){
    res.render("student-home");
})
app.get("/faculty-home",function(req,res){
    res.render("faculty-home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/faculty-login",function(req,res){
    res.render("faculty-login");
})
app.get("/faculty-register",function(req,res){
    res.render("faculty-register");
})
app.get("/logout",function(req,res){
    res.redirect("/");
})
app.get("/fun-page",function(req,res){
    res.render("fun-page")
})

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login")
    }
})

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/fun-page");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })
})

app.post("/login",function(req,res){
    const user=new User({
        username:req.body.username,
        password:req.body.password
    })
    req.login(user,function(err){
        if(err)
        console.log(err);
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })

})


app.listen(3000 || process.env.PORT,function(){
    console.log('on my way...');
})