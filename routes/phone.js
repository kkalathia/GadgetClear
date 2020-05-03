const express = require('express');
const router = express.Router();
const fetchDetails = require('../data/fetchDetails');


router.get('/', async (req, res) => {
  // if (req.query.brand) {
  //   const regex = new RegExp(escapeRegex(req.query.brand), 'gi');
  //
  //   mobiles.find({brand: regex},function(err,getDisplayDetails){
  //       res.render('phone/phonelist', {brand: getDisplayDetails});
  //     });
  //   }else {
      res.render('phone/homepage');
    // }

});

router.get('/phonelst', async (req, res) => {
    // if (req.query.brand) {
    //   const regex = new RegExp(escapeRegex(req.query.brand), 'gi');
    //
    //   mobiles.find({brand: regex},function(err,getDisplayDetails){
    //       res.render('phone/phonelist', {brand: getDisplayDetails});
    //     });
    //   }else {
        console.log('as')
        res.render('phone/phonelist');
      // }
  
  });
  


router.post('/submit', async (req, res) => {

  // if (req.query.brand) {
  //   const regex = new RegExp(escapeRegex(req.query.brand), 'gi');
  //
  //     mongoCollections.mobiles.find({brand: regex},function(err,getDisplayDetails){
  //       res.render('phone/phonelist', {brand: getDisplayDetails});
  //     });
  //   }




    const brand = req.body.brand;
    const display = req.body.display;
    const processor = req.body.processor;
    const storage = req.body.storage;
    console.log(brand);
    console.log(display);
    console.log(processor);
    console.log(storage);
    const getDevice = await fetchDetails.getDevice(brand,display,processor,storage)
    // const getDeviceDisplay = await fetchDetails.getDeviceDisplay(getDeviceByBrand);

    
    // //const getDeviceBrand = await fetchDetails.getDeviceBrand(brand)
    // const getDeviceProcessor = await fetchDetails.getDeviceProcessor(processor)
    // const getDeviceStorage = await fetchDetails.getDeviceStorage(storage)
    // console.log('details: ', getDeviceDisplay)
    // console.log('brand: ', getDeviceBrand)
    // console.log('processor: ', getDeviceProcessor)
    // console.log('storage: ', getDeviceStorage)
    res.render('phone/phonelist', {
       brand: getDevice,
    });
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

function escapeRegex(text) {

    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

}
module.exports = router;
