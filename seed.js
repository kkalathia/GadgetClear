const dbConnection = require('./config/mongoConnection');
const comments = require('./data/comments');
const fetchDetails = require('./data/fetchDetails');
ObjectId = require('mongodb').ObjectID;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    
    const newcomment = await comments.createcomments("5ebb7d72e4fd3e35b24006bd", "eric","This phone is greate!");
    console.log(newcomment);
    let id = newcomment._id;
    console.log(id);
    const get_comment = await comments.getcommentById(id);
    console.log(get_comment);
    const delete_comment = await comments.deletecomment(id);
    const all_comment = await comments.getAllcomment();
    console.log(all_comment);

    await db.serverConfig.close();
    console.log('Done!');
}

main();