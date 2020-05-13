const express = require('express');
const router = express.Router();
const fetchDetails = require('../data/fetchDetails');
const comments = require('../data/comments');
ObjectId = require('mongodb').ObjectID;


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
    let the_comments = await comments.getcommentByDevice(getDeviceById);

    res.render('phone/phonedetails', {
        brand: getDeviceById,
        username: the_comments.author,
        posts: the_comments
    });
})

router.post('/getMobileById/comment', async (req, res) => {
    //console.log("==================");
    const getDeviceById = await fetchDetails.getDeviceById(req.query.dev_id);
    let postContent = req.body.postContent;
    
    try{
		let add_comment = await comments.createcomments(getDeviceById,"author",postContent);
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


module.exports = router;
