const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User"); // Adjust the path as per your project structure
const crypto = require("crypto");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found." });
        }

        const saltRounds = 10;
        let totalUpdated = 0;

        // Regex patterns for credit card and pancard
        const creditCardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;  // Matches xxxx-xxxx-xxxx-xxxx
        const pancardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;  // Matches ABCDE1234A

        for (const user of users) {
            let updates = {};

            for (const key in user._doc) {
                if (typeof user[key] === "string") {
                    // Check for Credit Card format
                    if (creditCardPattern.test(user[key])) {
                        updates[key] = await bcrypt.hash(user[key], saltRounds);
                    }
                    // Check for PAN Card format
                    if (pancardPattern.test(user[key])) {
                        updates[key] = await bcrypt.hash(user[key], saltRounds);
                    }
                }
            }

            // Update user if changes exist
            if (Object.keys(updates).length > 0) {
                await User.updateOne({ _id: user._id }, updates);
                totalUpdated++;
            }
        }

        res.json({
            message: "Successfully hashed sensitive fields (Credit Card & PAN Card).",
            totalUpdated
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Function to hash data using SHA-256
const hashData = (data) => {
    return crypto.createHash("sha256").update(data).digest("hex");
};

// Regex patterns for credit card and PAN card
// const creditCardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;  // Matches xxxx-xxxx-xxxx-xxxx
// const pancardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;  // Matches ABCDE1234A
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Parse the JSON object from the environment variable
const regexPatterns = JSON.parse(process.env.REGEX_PATTERNS);

// Convert each regex string into a RegExp object
const regexArray = Object.values(regexPatterns).map(pattern => new RegExp(pattern));

let intervalId = null;

router.get("/encode", async (req, res) => {
    if (intervalId) {
        return res.json({ message: "Encoding process is already running every 10 seconds." });
    }

    const processEncoding = async () => {
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            if (collections.length === 0) {
                console.log("No collections found.");
                return;
            }
    
            let totalCollectionsChecked = 0;
            let totalUpdatedRecords = 0;
    
            for (const collection of collections) {
                const collectionName = collection.name;
    
                // ✅ Check if model already exists before defining it
                const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    
                const documents = await Model.find({});
                if (documents.length === 0) continue;
    
                let updatedCount = 0;
    
                for (const doc of documents) {
                    let updates = {};
                    for (const key in doc._doc) {
                        if (typeof doc[key] === "string") {
                            const isMatch = regexArray.some(regex => regex.test(doc[key]));
                            if (isMatch) {
                            // if (creditCardPattern.test(doc[key]) || pancardPattern.test(doc[key] || emailRegex.test(doc[key]))) {
                                updates[key] = hashData(doc[key]);
                            }
                        }
                    }
    
                    if (Object.keys(updates).length > 0) {
                        await Model.updateOne({ _id: doc._id }, { $set: updates });
                        updatedCount++;
                    }
                }
    
                if (updatedCount > 0) {
                    totalUpdatedRecords += updatedCount;
                    totalCollectionsChecked++;
                    console.log(`✅ Hashed & Updated ${updatedCount} records in collection: ${collectionName}`);
                }
            }
    
            console.log({
                message: "Successfully hashed sensitive fields across all collections.",
                totalCollectionsChecked,
                totalUpdatedRecords
            });
    
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    // Run the encoding function immediately
    processEncoding();

    // Start running the function every 10 seconds
    intervalId = setInterval(processEncoding, 10000);

    res.json({ message: "Encoding started, running every 10 seconds." });
});

router.get("/stop-encode", (req, res) => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        return res.json({ message: "Encoding process stopped." });
    }
    res.json({ message: "No active encoding process." });
});

router.get("/decode", async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found." });
        }

        // Regex patterns for PAN card and Credit Card
        const creditCardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        const pancardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        let decodedUsers = users.map(user => {
            let decodedData = { ...user._doc };

            // Decode only pancard and credit card fields
            if (typeof user.pancard === "string") {
                decodedData.pancard = Buffer.from(user.pancard, "base64").toString("utf8");
            }
            if (typeof user.creditCard === "string") {
                decodedData.creditCard = Buffer.from(user.creditCard, "base64").toString("utf8");
            }

            return decodedData;
        });

        console.log("🔓 Decoded User Data:", decodedUsers);
        res.json({ message: "Decoded values logged to console.", decodedUsers });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
