const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());


const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir, { recursive: true }); }
app.use('/images', express.static('public/images'));


mongoose.connect("mongodb+srv://mohammedaman6387_db_user:password_db@usermanagement.gwk3bn0.mongodb.net/user_management_db")
    .then(() => console.log("✅ MongoDB Connected"));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    image: String
}));


const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, Date.now() + "_" + file.originalname); }
});
const upload = multer({ storage: storage });


app.post('/api/register', upload.single('profileImage'), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            image: req.file ? req.file.filename : ""
        });
        await newUser.save();
        res.status(201).json({ message: "Registration Complete! ✅" });
    } catch (err) { res.status(400).json({ message: "Error: Email exists." }); }
});


app.get('/api/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});


app.put('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { username: req.body.username });
        res.json({ message: "Updated!" });
    } catch (err) { res.status(500).json({ message: "Update failed" }); }
});


app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("🚀 Server running on 5000"));
