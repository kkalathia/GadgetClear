const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const { ObjectId } = require("mongodb");
const user = require('./login.js');

async function createReviews(device_name, name, comment){
    if(arguments.length < 3) {
        throw "Input not valid";
    }
    //let user1 = await user.getUserById(id);
    const reviewCollection = await reviews();

    const newReview = {
        device_name: device_name,
        name: name,
        comment: comment
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) {
     throw `Failed to create the review`;
    }
    const newId = insertInfo.insertedId;

    const review = await this.getReviewById(newId);
    return review;
}

async function getAllReview() {
    const reviewCollections = await reviews();
    let reviewList = await reviewCollections.find({}).toArray();
    return reviewList;
}

async function getReviewById(id) {
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({_id: id});

    if (!review) throw 'Review not found';
    return review;
  }

  async function deleteReview(id) {
    if (!id) throw 'You must provide an id to search for';

    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({_id: id})
    if(review == null) throw "review not found";
    const deletionInfo = await reviewCollection.removeOne({_id: id});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete review with id of ${id}`;
    }

    return review;
  }

  async function deleteAllReviews(){
    const postCollection = await reviews();
    await postCollection.deleteMany({});
  }

  module.exports = {
      createReviews,
      getAllReview,
      getReviewById,
      deleteReview,
      deleteAllReviews
  }