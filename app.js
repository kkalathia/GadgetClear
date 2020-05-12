const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const exphbs = require("express-handlebars");
const userData =  require("./data/login"); //get user details for here
const session = require('express-session');
var xss = require("xss");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  {extended:true}
));
const static = express.static(__dirname + '/public');

//const session = require('express-session');

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

app.use(express.static(__dirname + '/public'));
const expressSession = require('express-session')({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
  });
  app.use(expressSession);
app.use(bodyParser.json());
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/*/login system start/*/
app.use("/",async (req,res,next)=>{
   
	let time = new Date().toUTCString();
	if(xss(req.session.flag)!==true){
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

	let username=xss(req.body.username);
	let password=xss(req.body.password);
	let persistUsername=username; //saves the username to show on page incase login fails
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
	   error: "Invalid username or password",
	   username:persistUsername });
	  return;
	 }
	 else {
	  if (await bcrypt.compareSync(password,User.hashedPassword)) {
		req.session.user=User;
		
	  }
	  else{
		  res.status(401).render('login', {title:"Login",
		  heading:"Login",
		   error: "Invalid username or password" ,
		username:persistUsername});
		  return;
	  }
	}
	if (!req.session.user) {
	  res.render('login', { title:"Login",
	  heading:"Login",
	  error: "Invalid username or password.",
	  username:persistUsername });
	}
	else {
	  req.session.flag=true;
	  res.render("user",{username:User.username , title:"Devices", session:true, message:"Logged In!"});
	}
  
   }
  
  
  });
  

  //create a new user
  app.get("/creatUser",async(req,res)=>{
		res.render("createUser");

  });

 app.post("/creatUser",async(req,res)=>{

	
	  if(!req.body.username){
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
		let username=xss(req.body.username);
		let password=xss(req.body.password);
		let email=xss(req.body.email);
		email=email.toLowerCase();
	   let User=await userData.checkUser(username);
	   let UserEmail=await userData.checkEmail(email);
		if(User===false && UserEmail===false){
		 userData.createUser(username,email,password);
		 res.render("login",{error:"User succesfully created .Please log in!"});
		}
		else {
		  res.render('createUser',{error:"User or email already exists"})
		 }
	   }
	   
	 
	  

 });

 app.get("/logout", async (req,res)=>{
	 if(!req.session.flag){
		res.render("login",{error:"You are not logged in!"});
		return;
	 }
	let user=req.session.user.username;
	req.session.flag=undefined;
	req.session.destroy();
	res.render("login",{error:"You are now logged out!"});
  });
/*/login system end/*/

  
app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});



//add compare device here
app.get("/compare", async (req, res) => {
	res.render("stars");
});

//add individual device page here
app.get("/device", async (req, res) => {
	res.render("device");
});


//calculates the stars per user
app.post("/starCalc", async (req, res) => {

	score=xss(req.body.value);
	console.log(score);

	//check user in device details page and add a mongo doc
	// if(user exists overwrite){}
// 	data={
// 		user:user_id,
// 		{
// 			rating=score;
// 		}
// 	}
// }
// else{
// 	insert into device page
// }


// });

});





app.use("*",async (req,res)=>{
	res.status(404).json({error:"Page Not Found"});
  });


  
