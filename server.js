if(process.env.NODE_ENV!=='production'){
       require('dotenv').config()
}
const express =require('express')
const app =express()
const bcrypt =require('bcrypt');
const ejs = require('ejs');
const flash =require('express-flash')
const session =require('express-session')
const passport =require('passport')
const methodOverride = require('method-override');
const initializePassport =require('./passport.config')
initializePassport(passport,
       email => users.find(user => user.email==email), 
       id => users.find(user => user.id==id) 

       )
const users=[]
app.set('myviews-engine',ejs);
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(methodOverride('_method'))
app.use(session({
   secret:process.env.SESSION_SECRET,
   resave:false, 
   saveUninitialized:false 
}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/',cheeckAuthenticated,(req,res)=>{   //a requst variable and response variable
//setting up the view engiens so that we can use ejs here
       res.render('index.ejs',{name: req.user.name})
})
//we created two diffrent pages for the view in and 
//now we are creating routes for both of them
app.get('/login',cheeckNoAuthenticated,(req,res)=>{
       res.render('login.ejs')  
})
app.post('/login',cheeckNoAuthenticated,passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true,
}))
app.get('/register',cheeckNoAuthenticated,(req,res)=>{
       res.render('register.ejs')  
})
app.post('/register',cheeckNoAuthenticated,async (req,res)=>{
try {
    const hashedPassword=await bcrypt.hash(req.body.password,10);   
    users.push({
      id:Date.now().toString(),
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword
    })
    res.redirect('/login');
} catch (error) {
  res.redirect('/register')     
}  
})
console.log(users)
app.delete('/logout', function(req, res) {
       req.logOut(function(err) {
         if (err) {
           return next(err);
         }
         res.redirect('/login');
       });
     });
function cheeckAuthenticated(req,res,next){
       if(req.isAuthenticated()){
          return next()    
       }
       res.redirect('/login');
}
function cheeckNoAuthenticated(req,res,next){
       if(req.isAuthenticated()){
        return res.redirect('/')  
       }
       next()
}

app.listen(3001)