if(process.env.NODE_ENV !=="production"){
       require("dotenv").config()
}



const express=require("express")
const app=express()
const bcrypt=require("bcrypt")
const intilizepassport=require("./passport-config")
const passport = require("passport")
const flas=require("express-flash")
const session=require("express-session")
const flash = require("express-flash")

intilizepassport(
    passport,
    email=>users.find(user => user.email===email),
    id=>users.find(user=>user.id ===id)
    )


const users=[]

app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRETE,
    resave:false,//we wont the session verable
    saveUninitialized:false
}))
app.use(passport.initialize()) 
app.use(passport.session())

//configauration the register post function
app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))
app.post("/register",async(req,res)=>{
    try {
          const hasedpassword=await bcrypt.hash(req.body.password,10)
          users.push({
            id: Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hasedpassword,
          })
          console.log(users);//display the users register
          res.redirect("/login")

    } catch (error) {
        console.log(error);
        res.redirect("/register")
    }
})


//rooters
app.get('/',(req,res)=>{
    res.render("index.ejs",{name: req.user.name})
})
app.get('/login',(req,res)=>{
    res.render("login.ejs")
})
app.get('/register',(req,res)=>{
    res.render("register.ejs")
})


app.listen(3000)
