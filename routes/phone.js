const express = require('express');
const router = express.Router();
const fetchDetails = require('../data/fetchDetails');
const xss=require('xss');
const mongoCollections = require('../config/mongoCollections');
const phones = mongoCollections.mobiles;
const { ObjectId } = require('mongodb')
const comments = require('../data/comments');
//ObjectId = require('mongodb').ObjectID;


router.get('/search', async (req, res) => {
    res.render('phone/homepage');
});

router.get('/phonelist', async (req, res) => {

    res.render('phone/phonelist');
});

router.post('/submit', async (req, res) => {
    const brand = req.body.brand;
    const display = req.body.display;
    const processor = req.body.processor;
    const storage = req.body.storage;

    const getDevice = await fetchDetails.getDevice(brand, display, processor, storage)

    res.render('phone/phonelist', {
       brand: getDevice
    });
});

router.get('/getMobileById', async (req,res) => {
    const getDeviceById = await fetchDetails.getDeviceById(req.query.dev_id);
    req.session.deviceToRate=req.query.dev_id;
console.log(getDeviceById);
    let the_comments = await comments.getcommentByDevice(getDeviceById);

    res.render('phone/phonedetails', {
        brand: getDeviceById,
        username: the_comments.author,
        posts: the_comments,
        rating: getDeviceById.overallRating
    });
})

router.post('/getMobileById/comment', async (req, res) => {
    //console.log("==================");
    const getDeviceById = await fetchDetails.getDeviceById(req.session.deviceToRate);
    let postContent = req.body.postContent;
    const userinfo = req.session.user;
    let author = "";
    if(userinfo != undefined && userinfo != null){
        author = userinfo.username;
    }else{
        author = "anonymous";
    }
    
    try{
		let add_comment = await comments.createcomments(getDeviceById,author,postContent);
		res.status(200).end();
	}catch(e){
		console.log("There was an error! " + e);
		res.status(400).end();
	}
})

router.post("/getMobileById/removeComment", async (req, res) => {
    let comment = req.body.postId;
    if(typeof comment == "string"){
        let id = ObjectId(comment);
    }
	//console.log(typeof id);

	try{
		let remove_comment = await comments.deletecomment(id);
		res.status(200).end();
	}catch(e){
		console.log("There was an error! " + e);
		res.status(400).end();
	}

});

router.post('/compare', async (req, res) => {
    const deviceOne = req.body.deviceOne;
    const deviceTwo = req.body.deviceTwo;

    res.render('phone/comparedevice', {
        deviceOne: deviceOne,
        deviceTwo: deviceTwo
    });
})

router.get('/phone', async (req, res) => {
    const device = req.body.device;

    res.render('phone/phonedetails', {
        device: device
    });
})

router.get('/buy', async (req, res) => {
    const link = req.body.link;

    res.render('phone/buydevice', {
        link: link
    })
})

router.post("/starCalc", async (req, res) => {
    
    //console.log(req.session.deviceToRate);
    const score=xss(req.body.value);
    deviceId=ObjectId(req.session.deviceToRate);
    //console.log(req.session.user._id);
    const mobileCollection= await phones();
    const userid=req.session.user._id;
    const usersRating={
        userid,
        score
        
    }
    
    const getDevice = await fetchDetails.getDeviceById(req.session.deviceToRate);
let flag=1; //checks if inserted in for loop

for(let i=0;i<await getDevice.UserRating.length;i++){
    if(await getDevice.UserRating[i].userid===userid){
            //console.log("here");
        
         flag=0;
            await mobileCollection.updateOne( {_id : deviceId , "UserRating.score" : await getDevice.UserRating[i].score } , 
            {$set : {"UserRating.$.score" : score} } , 
            false , 
            true);

    }
}
    if(flag===1){
        await mobileCollection.updateOne({_id:deviceId }, {$addToSet: {UserRating:usersRating}});
    }
    
   
    const check=getDevice.UserRating;
    //console.log(check);

    //update overall rating
    let finalRating=parseFloat(0);
    for(let j=0;j<await getDevice.UserRating.length;j++){
     
       // console.log("score"+getDevice.UserRating[j].score);
       finalRating=finalRating+await getDevice.UserRating[j].score;
    
    }
    let ratingLength=await getDevice.UserRating.length;
    if(ratingLength===0){
    finalRating=finalRating/1;
    }
    else{
        finalRating=finalRating/ratingLength;
    }
    //console.log("final"+finalRating);
    await mobileCollection.updateOne({_id:deviceId }, {$set: {overallRating:finalRating}});


});



module.exports = router;
