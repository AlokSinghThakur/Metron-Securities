const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const User = require("./models/User"); // Import User Model
const Employee = require("./models/Employee");
const Order = require("./models/Order")

// const MONGO_URI = "mongodb+srv://alok:OctWrEGZLiVpQz8t@cluster0.z3chw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URI = process.env.MONGO_URI; // Load from .env
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected Successfully!");

        // Insert 10 Users with PAN Card
        await insertUsers();
        await insertEmployees();
        await insertOrders();

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

// Function to insert 10 sample users
const insertUsers = async () => {
    try {
        const users = [
    { name: "John Doe", email: "ABCDE1234A", password: "pass123", pancard: "ABCDE1234A", creditCard: "4721-9834-5627-1043" },
    { name: "Jane Doe", email: "jane@example.com", password: "pass123", pancard: "FGHIJ5678B", creditCard: "5293-6478-3120-4598" },
    { name: "Alice Smith", email: "alice@example.com", password: "pass123", pancard: "KLMNO9101C", creditCard: "6011-3492-7835-2201" },
    { name: "Bob Brown", email: "bob@example.com", password: "pass123", pancard: "PQRST2345D", creditCard: "3782-0145-7863-9024" },
    { name: "Charlie Black", email: "charlie@example.com", password: "pass123", pancard: "UVWXY6789E", creditCard: "4539-6021-8954-7632" },
    { name: "David Green", email: "david@example.com", password: "pass123", pancard: "ABCDE5432F", creditCard: "5104-2198-7645-3851" },
    { name: "Eve White", email: "eve@example.com", password: "pass123", pancard: "FGHIJ8765G", creditCard: "6011-8793-4520-1764" },
    { name: "Frank Blue", email: "frank@example.com", password: "pass123", pancard: "KLMNO2109H", creditCard: "3472-6098-2314-7590" },
    { name: "Grace Yellow", email: "grace@example.com", password: "pass123", pancard: "PQRST8765I", creditCard: "4532-1984-6270-3491" },
    { name: "Hank Red", email: "hank@example.com", password: "pass123", pancard: "UVWXY5432J", creditCard: "3759-8146-2035-6748" }
];

        // Check if data already exists
        const existingUsers = await User.countDocuments();
        if (existingUsers === 0) {
            await User.insertMany(users);
            console.log("✅ 10 Users Inserted Successfully!");
        } else {
            console.log("ℹ️ Users already exist. Skipping insertion.");
        }

    } catch (error) {
        console.error("❌ Error inserting users:", error);
    }
};
// Function to insert 5 sample employees
const insertEmployees = async () => {
    try {
        const employees = [
            { name: "Alex Johnson", department: "IT", position: "Software Engineer", salary: 70000, pancard: "AJITW1234X" },
            { name: "Sarah Lee", department: "HR", position: "HR Manager", salary: 65000, pancard: "SLHRW5678Y" },
            { name: "Michael Brown", department: "Finance", position: "Accountant", salary: 60000, pancard: "MBFNW9101Z" },
            { name: "Emily Davis", department: "Marketing", position: "Marketing Specialist", salary: 55000, pancard: "EDMKW2345A" },
            { name: "David Wilson", department: "Sales", position: "Sales Executive", salary: 50000, pancard: "DWSWL6789B" }
        ];

        const existingEmployees = await Employee.countDocuments();
        if (existingEmployees === 0) {
            await Employee.insertMany(employees);
            console.log("✅ 5 Employees Inserted Successfully!");
        } else {
            console.log("ℹ️ Employees already exist. Skipping insertion.");
        }
    } catch (error) {
        console.error("❌ Error inserting employees:", error);
    }
};

const insertOrders = async () => {
    try {
        const orders = [
            { orderId: "ORD001", orderName: "Laptop", userName: "John Doe", jibrish: "john@example.com" },
            { orderId: "ORD002", orderName: "Smartphone", userName: "Jane Doe", jibrish: "jane@example.com" },
            { orderId: "ORD003", orderName: "Wireless Headphones", userName: "Alice Smith", jibrish: "alice@example.com" },
            { orderId: "ORD004", orderName: "Gaming Console", userName: "Bob Brown", jibrish: "bob@example.com" },
            { orderId: "ORD005", orderName: "Smartwatch", userName: "Charlie Black", jibrish: "charlie@example.com" },
            { orderId: "ORD006", orderName: "Tablet", userName: "David Green", jibrish: "david@example.com" },
            { orderId: "ORD007", orderName: "Camera", userName: "Eve White", jibrish: "eve@example.com" },
            { orderId: "ORD008", orderName: "Bluetooth Speaker", userName: "Frank Blue", jibrish: "frank@example.com" },
            { orderId: "ORD009", orderName: "Monitor", userName: "Grace Yellow", jibrish: "grace@example.com" },
            { orderId: "ORD010", orderName: "Keyboard", userName: "Hank Red", jibrish: "hank@example.com" }
        ];

        const existingOrders = await Order.countDocuments();
        if (existingOrders === 0) {
            await Order.insertMany(orders);
            console.log("✅ 10 Orders Inserted Successfully!");
        } else {
            console.log("ℹ️ Orders already exist. Skipping insertion.");
        }
    } catch (error) {
        console.error("❌ Error inserting orders:", error);
    }
};

module.exports = connectDB;
