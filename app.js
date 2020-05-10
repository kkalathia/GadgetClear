const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const connectEnsureLogin = require('connect-ensure-login');
const bodyParser = require('body-parser');
//const session = require('express-session');

const exphbs = require('express-handlebars');

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

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());


/*/ Mongoose setup/*/
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/GadgetClear',
  { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String,
  email:String
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());


app.post('/login', (req, res, next) => {
	passport.authenticate('local',
	(err, user, info) => {
	  if (err) {
		return next(err);
	  }
  
	  if (!user) {
		  //console.log(info);
		return res.render('login',{error:info.message});
	  }
  
	  req.logIn(user, function(err) {
		if (err) {
		  return next(err);
		}
  
		return res.redirect('/');
	  });
  
	})(req, res, next);
  });
  app.get('/login',async (req, res) => {
	res.render('login');
 
  });

app.get('/',connectEnsureLogin.ensureLoggedIn(),async (req, res) => {
	console.log(req.user);
	res.render('user',{user:req.user.username});
});

app.get('/private',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('html/private.html', {root: __dirname})
);

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);

/*/mongoose setup end /*/



// app.get("/", async (req, res) => {
// 	res.render('user');
// });

// app.get("/home", async (req, res) => {
// 		res.render("user");
// });

// app.get("/phones", async (req, res) => {
// 	res.render("List");
// });

// app.get("/search", async (req, res) => {
// 	res.render("result");
// });

// app.get("/reviews", async (req, res) => {
// 	res.render("review");
// });

UserDetails.register({username:'glena', active: false}, 'glen',em);
// UserDetails.register({username:'jay', active: false}, 'jay');
// UserDetails.register({username:'roy', active: false}, 'roy');