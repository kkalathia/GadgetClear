const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const exphbs = require("express-handlebars");
const userData =  require("./data/login");
const session = require('express-session');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  {extended:true}
));
const static = express.static(__dirname + '/public');

app.use(session({
	key:"AuthCookie",
	secret: 'some secret string!',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
  }));



app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use("/",async (req,res,next)=>{
   
	let time = new Date().toUTCString();
	if(req.session.flag!==true){
		console.log("["+time+"]: "+req.method+" "+req.originalUrl+" (Non-Authenticated User)");
	}else{
		console.log("["+time+"]: "+req.method+" "+req.originalUrl+" (Authenticated User)");
	}
	next();
  });
  app.get("/", async(req,res)=>{
	if(!req.session.flag){
		res.render("login",{title:"User login",heading:"User login"});
	}
	else {
	  
		res.render('user');
		
	} 
  });

///login post

  app.post("/login",async(req,res)=>{
    
	if(!req.body.username && !req.body.password){
	  res.render("login",{title:"Login",
	  heading:"Login",
	  error: "enter a username and password"});
	}
	else if(!req.body.username){
	  res.render("login",{title:"Login",
	  heading:"Login",
	  error: "enter a valid username"});
	}
	else if(!req.body.password){
	  res.render("login",{title:"Login",
	  heading:"Login",
	  error: "enter a valid password"});
	}
   else{
	 let username=req.body.username;
	 let password=req.body.password;
	 //let email=req.body.email;
	let User=await userData.checkUser(username);
	 if(User===false){
	  res.status(401).render('login', { title:"Login",
	  heading:"Login",
	   error: "Invalid username." });
	  return;
	 }
	 else {
	  if (await bcrypt.compareSync(password,User.hashedPassword)) {
		req.session.user=User;
		console.log("entered")
	  }
	  else{
		  res.status(401).render('login', {title:"Login",
		  heading:"Login",
		   error: "Invalid password." });
		  return;
	  }
	}
	if (!req.session.user) {
	  res.render('login', { title:"Login",
	  heading:"Login",
	  error: "Invalid username or password." });
	}
	else {
	  req.session.flag=true;
	  res.render("user");
	}
  
   }
  
  
  });
  

  //create a new user
  app.get("/creatUser",async(req,res)=>{
		res.render("createUser");

  });

 app.post("/creatUser",async(req,res)=>{

	if(!req.body.username && !req.body.password){
		res.render("login",{title:"Login",
		heading:"Login",
		error: "enter a username and password"});
	  }
	  else if(!req.body.username){
		res.render("login",{title:"Login",
		heading:"Login",
		error: "enter a valid username"});
	  }
	  else if(!req.body.password){
		res.render("login",{title:"Login",
		heading:"Login",
		error: "enter a valid password"});
	  }
	  else{
		let username=req.body.username;
		let password=req.body.password;
		let email=req.body.email;
	   let User=await userData.checkUser(username);
		if(User===false){
		 userData.createUser(username,email,password);
		 res.redirect("/");
		}
		else {
		  res.render('createUser',{error:"User or email already exists"})
		 }
	   }
	   
	 
	  

 });

  
app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});

// app.get("/", async (req, res) => {
// 	res.render('user');
// });

app.get("/home", async (req, res) => {
		res.render("user");
});

app.get("/phones", async (req, res) => {
	res.render("List");
});

app.get("/search", async (req, res) => {
	res.render("result");
});

app.get("/reviews", async (req, res) => {
	res.render("review");
});


app.use("*",async (req,res)=>{
	res.status(404).json({error:"Page Not Found"});
  });

app.get("/logout", async (req,res)=>{
	let user=req.session.user.username;
	req.session.flag=undefined;
	req.session.destroy();
	res.render("logout",{title:"Logged out",heading:"Logged out",username:user});
  });
  