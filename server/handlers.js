"use strict";
const assert = require("assert");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017", {
  useUnifiedTopology: true,
});

const getSeats = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("test");
    const result = await db.collection("bookings").find().toArray();
    //all the seats that are in an array
    let data = {}; //this is creating an empty object to bring back all the seats (data) in, sending to the front end
    console.log(result);
    result.forEach((seat) => {
      data = { ...data, [seat._id]: seat };
    });
    return res.status(200).json({
      status: 200,
      data: data,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {
    console.log(err);
  }
  client.close();
};

//saving seat data down here

const completeOrder = async (req, res) => {
  try {
    await client.connect();

    const db = client.db("test");

    const { fullName, email, creditCard, expiration, seatId } = req.body;

    if (!creditCard || !expiration) {
      return res.status(400).json({
        status: 400,
        message: "Please provide credit card information!",
      });
    }
    const newValues = {
      $set: { isBooked: true, name: fullName, email: email },
    };
    const r = await db
      .collection("bookings")
      .updateOne({ _id: seatId }, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getSeats, completeOrder };
