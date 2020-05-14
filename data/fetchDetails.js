const mongoCollections = require('../config/mongoCollections');
const mobiles = mongoCollections.mobiles;
var ObjectId = require('mongodb').ObjectId; 


const getDevice = async (brand, display, processor, storage) => {
    const mobileCollection = await mobiles();

    const brands = brand.match(/^([\w\-\.]+)/)
    const displays = display.match(/^([\w\-\.]+)/)
    const pro = processor.split(' ')[1];
    const sto = storage;

    // console.log("Brand: ", brands[0])
    // console.log("Processor: ", processor.split(' ')[1]);
    // console.log("display: ", displays[0].split('.')[0]);
    // console.log("storage: ", storage);

    // var regexSize = `^([6^inches]*)`;
    // console.log('regex', regexSize)
    const res = await mobileCollection.find({
        'device': new RegExp(brands[0], 'i'), 
        'Size': new RegExp("^" + displays[0].split('.')[0]),
        'Chipset': new RegExp(pro, 'i'),
        'Internal': new RegExp(sto,'i')
    }).toArray();

    return res
};

const getDeviceById = async (id) => {
    var o_id = new ObjectId(id);

    const mobileCollection = await mobiles();
    const res = await mobileCollection.findOne({_id:  o_id});
    //console.log(res);
    return res;
}

const getCompareDevice = async (d1, d2) => {
    let resOne, resTwo;

    const mobileCollection = await mobiles();
    const all = await mobileCollection.find({}).toArray();

    // resOne = await mobileCollection.find({$or:[{device:{ $regex : new RegExp(d1, "i")} }]}).toArray();
    // resTwo = await mobileCollection.find({$or:[{device:{ $regex : new RegExp(d2, "i")} }]}).toArray();

    all.forEach(res => {
        if (d1.toLowerCase() === res.device.toLowerCase())
            resOne = res;
    })

    all.forEach(res => {
        if (d2.toLowerCase() === res.device.toLowerCase())
            resTwo = res;
    })

    // return [resOne, resTwo]
    // console.log("resOne: ", resOne);
    // console.log("resTwo:", resTwo);

    return [resOne, resTwo]
}


module.exports = {
    getDevice,
    getDeviceById,
    getCompareDevice
};

