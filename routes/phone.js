const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.render('phone/homepage');
});

router.post('/submit', async (req, res) => {
    const brand = req.body.brand;
    const display = req.body.display;
    const processor = req.body.processor;
    
    res.render('phone/phonelist', {
       brand: brand,
       display: display,
       processor: processor, 
    });
})

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