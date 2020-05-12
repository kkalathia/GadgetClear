const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const exphbs = require("express-handlebars");
const cookies = require("cookie-parser");
const userData =  require("./data/login");
const session = require('express-session');
const reviews = require("./data/review");
ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  {extended:true}
));
app.use(cookies());
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

//login get 
  app.get("/login", async (req,res)=>{
	res.redirect("/");
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
	   let flag=0;
	let username=req.body.username;
	let password=req.body.password;
	if (/\@/.test(username)) {
        // Validate email address
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) {
			flag =1;
		
		}
	}
	let User;
	 if(flag===0){
	 //let email=req.body.email;
	User=await userData.checkUser(username);

	 }
	 else{
		username=username.toLowerCase();
		 User=await userData.checkEmail(username);
		
		 
	 }
	 //console.log(User);
	 if(User===false){
	  res.status(401).render('login', { title:"Login",
	  heading:"Login",
	   error: "Invalid username." });
	  return;
	 }
	 else {
	  if (await bcrypt.compareSync(password,User.hashedPassword)) {
		req.session.user=User;


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
	  //console.log(User._id);
	  //console.log(req.session.user)
	  res.cookie("Auth_Cookie",User.username);
	  res.render("user",{username:User.username , title:"Devices", session:true});
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
	  else if(!req.body.email){
		res.render("login",{title:"Login",
		heading:"Login",
		error: "enter a valid email"});
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
		email=email.toLowerCase();
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

 app.get("/logout", async (req,res)=>{
	 if(!req.session.flag){
		res.render("login",{error:"You are not logged in!"});
	 }
	let user=req.session.user.username;
	req.session.flag=undefined;
	req.session.destroy();
	res.redirect("/");
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
	//console.log(req.cookies.Auth_Cookie);
	let user = await userData.checkUser(req.cookies.Auth_Cookie);
	//console.log(user);

	try{
	let allReviews = await reviews.getAllReview()
	//console.log(user.username);
	res.render("reviews",{
		title: "Review page",
		username: user.username,
		posts: allReviews
	});
	console.log("rendered reviews")
	}catch(e){
		console.log(e);
	}
});

app.post("/reviews/newReview", async (req, res) => {

	let user = await userData.checkUser(req.cookies.Auth_Cookie);
	//let name = req.body.username;
	//console.log("the name is" + name);
	let postTitle = req.body.postTitle;
	let postContent = req.body.postContent;

	try{
		let addedPost = await reviews.createReviews(postTitle,user.username,postContent);
		res.status(200).end();
	}catch(e){
		console.log("There was an error! " + e);
		res.status(400).end();
	}

});

app.post("/reviews/removeReview", async (req, res) => {
	let review = req.body.postId;
	let id = ObjectId(review);
	//console.log(typeof id);

	try{
		var removeReview = await reviews.deleteReview(id);
		res.status(200).end();
	}catch(e){
		console.log("There was an error! " + e);
		res.status(400).end();
	}

});


app.use("*",async (req,res)=>{
	res.status(404).json({error:"Page Not Found"});
  });



  