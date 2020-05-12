const express = require('express');
const router = express.Router();
const fetchDetails = require('../data/fetchDetails');


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

    res.render('phone/phonedetails', {
        brand: getDeviceById,
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
