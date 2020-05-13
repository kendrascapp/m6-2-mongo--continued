const router = require("express").Router();
const { MongoClient } = require("mongodb");
const assert = require("assert");
const { getSeats, completeOrder } = require("./handlers");

const client = new MongoClient("mongodb://localhost:27017", {
  useUnifiedTopology: true,
});

const batchImport = async () => {
  try {
    client.connect();
    const db = await client.db("test");
    console.log("values", values);
    await db.collection("bookings").insertMany(values);
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

//Code that is generating the seats.
//----------------------------------
const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      price: 225,
      isBooked: false,
    };
  }
}

const values = Object.values(seats);
const keys = Object.keys(seats);
values.forEach((obj, index) => {
  obj["_id"] = keys[index];
});
console.log(values);

batchImport();

// ----------------------------------

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", completeOrder);

module.exports = router;
