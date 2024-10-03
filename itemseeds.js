const mongoose = require('mongoose');
const Item = require('./Models/item'); // Adjust the path to your model file
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB (adjust the connection string as needed)
mongoose
  .connect("mongodb://127.0.0.1:27017/CollegeCanteen")
  .then(() => {
    console.log("Successfully connected to MONGO");
  })
  .catch((err) => {
    console.log("ERRORR!!!", err);
  });

// Define the items array with UUIDs generated directly
const items = [
    { _id: uuidv4(), name: "SAMOSA", price: 15, image: "SAMOSA.jpg" },
    { _id: uuidv4(), name: "OREO SHAKE", price: 45, image: "OREO-SHAKE.jpg" },
    { _id: uuidv4(), name: "VEG BURGER", price: 50, image: "BURGER.jpg" },
    { _id: uuidv4(), name: "MASALA DOSA", price: 50, image: "dosa.jpg" },
    { _id: uuidv4(), name: "SPRING ROLLS", price: 40, image: "Vegetable-Spring-Rolls-4.jpg" },
    { _id: uuidv4(), name: "FRENCH FRIES", price: 35, image: "FRENCH FRIES.jpg" },
    { _id: uuidv4(), name: "COFFEE", price: 10, image: "FILTER-COFFEE.jpg" },
    { _id: uuidv4(), name: "FRIED RICE", price: 55, image: "FRIED-RICE.jpg" },
    { _id: uuidv4(), name: "VADAPAV", price: 20, image: "VADAPAV.jpg" },
    { _id: uuidv4(), name: "DONUT", price: 30, image: "DONUT.jpg" },
    { _id: uuidv4(), name: "NOODLES", price: 50, image: "NOODLES.jpg" },
    { _id: uuidv4(), name: "CUTLET", price: 20, image: "CUTLET.jpg" },
    { _id: uuidv4(), name: "KULFI", price: 15, image: "KULFI.jpg" },
    { _id: uuidv4(), name: "PAROTTA", price: 50, image: "PAROTA.jpg" },
    { _id: uuidv4(), name: "CLUB SANDWICH", price: 45, image: "SANDWICH.jpg" },
    { _id: uuidv4(), name: "BROWNIE", price: 65, image: "BROWNIE.jpg" }
];

// Insert items into the database
Item.insertMany(items)
    .then(result => {
        console.log('Items inserted successfully:', result);
        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error inserting items:', error);
        mongoose.connection.close();
    });
