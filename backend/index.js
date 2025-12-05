//  Import libs.
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors()); // To access server from localhost
app.use(express.json()); // To read JSON request body (POST/PUT)
app.use("/uploads", express.static("uploads")); // Allowing browser to access the uploads folder

// Connect mysql
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project_pweb"
});

// Upload image configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // Save file destination
    filename: (req, file, cb) => 
        cb(null, Date.now() + path.extname(file.originalname)) // Create a unique filename for each image
});
const upload = multer({ storage }); // Applying the configuration to multer

// Take all books
app.get("/buku", (req, res) => {
    db.query("SELECT * FROM buku", (err, result) => { // Query sql to take all the books
        if (err) throw err;
        res.json(result); // Getting the result in json form
    });
});

// Add book
app.post("/buku", upload.single("gambar"), (req, res) => {
  const { judul, penulis, tahun, harga } = req.body; // Taking input data from input form
  const gambar = req.file ? req.file.filename : null; // If user upload with picture then take the filename

  const sql = "INSERT INTO buku (judul, penulis, tahun, harga, gambar) VALUES (?,?,?,?,?)";
  db.query(sql, [judul, penulis, tahun, harga, gambar], (err, result) => {
    if (err) return res.status(500).json({ error: err.message }); // Message if error
    res.json({ message: "Berhasil tambah!", id: result.insertId }); // Message if success
  });
});

// Edit book
app.put("/buku/:id", upload.single("gambar"), (req, res) => {
    const { judul, penulis, tahun, harga } = req.body; // Taking the data from the input
    const id = req.params.id; // Taking id from the url

    let sql = ""; // sql update for placeholder
    let data = []; // Data placeholder

    // Update filename
    if (req.file) {
        sql = "UPDATE buku SET judul=?, penulis=?, tahun=?, harga=?, gambar=? WHERE id=?";
        data = [judul, penulis, tahun, harga, req.file.filename, id];
    } else {
        sql = "UPDATE buku SET judul=?, penulis=?, tahun=?, harga=? WHERE id=?";
        data = [judul, penulis, tahun, harga, id];
    }

    //  If error occured
    db.query(sql, data, err => {
        if (err) throw err;
        res.json({ message: "Buku diupdate" });
    });
});

// Delete book
app.delete("/buku/:id", (req, res) => {
    db.query("DELETE FROM buku WHERE id=?", [req.params.id], err => { // Getting the id from url
        if (err) throw err;
        res.json({ message: "Buku dihapus" });
    });
});

// -----------------------------------------------------

app.listen(5000, () => console.log("API berjalan pada port 5000"));
