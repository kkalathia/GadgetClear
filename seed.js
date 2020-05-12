const dbConnection = require('./config/mongoConnection');
const reviews = require('./data/review');
const user = require('./data/login')

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    
    const createReview = await reviews.createReviews("apple iphone 9", "iiphone", "The iphone is useful");
    const createReview2 = await reviews.createReviews("apple iphone 10", "iiphone", "The iphone is useful2");
    //const createReview3 = await reviews.createReviews("apple iphone 11", "iiphone", "The iphone is useful3");
    //const createuser = await user.createUser("aaaa","aaaa@yahoo.com","aaaa");
    //const id = createReview._id;
    //const userid = createuser._id;
    //console.log(userid)
    console.log(createReview);
    const deleterecord = await reviews.deleteReview(createReview._id);

    //const user1 = await user.getUserById(userid);
    //console.log(await user.checkUser("aaaa"));

    //console.log("the user is ");
    //console.log(user1);

    //const all = await reviews.getAllReview();
    //console.log(createReview);
    //console.log(all);
    //console.log(id);

    //const removereview = await reviews.deleteAllReviews();
    console.log("Comment deleted");

    await db.serverConfig.close();
    console.log('Done!');
}

main();