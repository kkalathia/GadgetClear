const bcrypt = require("bcrypt");
const mongoCollections = require('../config/mongoCollections');
//const albums = mongoCollections.albums;
const users= mongoCollections.users;
const { ObjectId } = require('mongodb')


async function createUser(username,email,password){
    
    //console.log(title);
		
		
		const userCollection = await users();
        hashedPassword=bcrypt.hashSync(password, 10)
		let newUser = {
             username,
             email,
             hashedPassword
		};

		const insertInfo = await userCollection.insertOne(newUser);
		if (insertInfo.insertedCount === 0) throw 'Could not add user';

		//const newId = insertInfo.insertedId;

		
		return true;
}

//checks for username in document and returns userdata with that username
async function checkUser(username){
   
    const userCollection = await users();
    
const usersindb = await userCollection.findOne({ username: username });

if (usersindb === null) {
    return false;
}
else{
    return usersindb;
}
 }


 async function checkEmail(email){
   
    const userCollection = await users();
    
const emailindb = await userCollection.findOne({ email: email });

if (emailindb === null) {
    return false;
}
else{
    return emailindb;
}
 }

module.exports={createUser,checkUser,checkEmail};