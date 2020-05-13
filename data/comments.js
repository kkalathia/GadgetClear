const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const { ObjectId } = require("mongodb");
const user = require('./login.js');

async function createcomments(device_id, author, comment){
    if(arguments.length < 3) {
        throw "Input not valid";
    }
    //let user1 = await user.getUserById(id);
    const commentCollection = await comments();

    const newcomment = {
        device_id: device_id,
        author: author,
        comment: comment
    };

    const insertInfo = await commentCollection.insertOne(newcomment);
    if (insertInfo.insertedCount === 0) {
     throw `Failed to create the comment`;
    }
    const newId = insertInfo.insertedId;

    const new_comment = await this.getcommentById(newId);
    return new_comment;
}

async function getAllcomment() {
    const commentCollections = await comments();
    let commentList = await commentCollections.find({}).toArray();
    return commentList;
}

async function getcommentById(id) {
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: id});

    if (!comment) throw 'comment not found';
    return comment;
  }

async function getcommentByDevice(id) {
  const commentCollection = await comments();
  const comment = await commentCollection.find({device_id: id}).toArray();
  if (!comment) throw 'comment not found';
  return comment;
}

  async function deletecomment(id) {
    if (!id) throw 'You must provide an id to search for';

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: id})
    if(comment == null) throw "comment not found";
    const deletionInfo = await commentCollection.removeOne({_id: id});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${id}`;
    }

    return comment;
  }

  async function deleteAllcomments(){
    const postCollection = await comments();
    await postCollection.deleteMany({});
  }

  module.exports = {
      createcomments,
      getAllcomment,
      getcommentById,
      deletecomment,
      deleteAllcomments,
      getcommentByDevice
  }