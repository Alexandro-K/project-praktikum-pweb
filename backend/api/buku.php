<?php
include "config.php";

//  Same as index
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Taking the methods and the url details
$method = $_SERVER["REQUEST_METHOD"];
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = $path[2] ?? $path[1] ?? null;

// GET - Take all the books from the database
if ($method === "GET") {
    $query = $koneksi->query("SELECT * FROM buku"); // Use connection and make query to select all the books
    echo json_encode($query->fetch_all(MYSQLI_ASSOC)); // Take all the books in json format
    exit;
}

// POST - Add new book
if ($method === "POST") {
    // Inputs and what the inputs if there are no value in there
    $judul = $_POST["judul"] ?? null;
    $penulis = $_POST["penulis"] ?? null;
    $tahun = intval($_POST["tahun"] ?? 0);
    $harga = intval($_POST["harga"] ?? 0);
    $gambarName = null;

    // Upload image
    if (isset($_FILES["gambar"]) && $_FILES["gambar"]["error"] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/../uploads/";
        
        // If upload directory not exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Creating unique image name
        $ext = pathinfo($_FILES["gambar"]["name"], PATHINFO_EXTENSION);
        $gambarName = time() . "_" . uniqid() . "." . $ext;
        
        // Move the image to the uploads folder
        move_uploaded_file($_FILES["gambar"]["tmp_name"], $uploadDir . $gambarName);
    }

    // Insert the data to the database
    $stmt = $koneksi->prepare("INSERT INTO buku (judul, penulis, tahun, harga, gambar) VALUES (?,?,?,?,?)");
    $stmt->bind_param("ssiss", $judul, $penulis, $tahun, $harga, $gambarName);
    $stmt->execute();

    // Alert if success
    echo json_encode(["message" => "Berhasil tambah!", "id" => $stmt->insert_id]);
    exit;
}

// PUT - Edit book
if ($method === "PUT") {
    // Jika ada file upload
    if (isset($_FILES["gambar"]) && $_FILES["gambar"]["error"] === UPLOAD_ERR_OK) {
        // Inputs and what the inputs if there are no value in there
        $judul = $_POST["judul"] ?? null;
        $penulis = $_POST["penulis"] ?? null;
        $tahun = intval($_POST["tahun"] ?? 0);
        $harga = intval($_POST["harga"] ?? 0);

        // Delete old image with the given id
        $old = $koneksi->query("SELECT gambar FROM buku WHERE id = $id");
        $oldData = $old->fetch_assoc();
        $oldPath = __DIR__ . "/../uploads/" . $oldData["gambar"];
        
        if ($oldData["gambar"] && file_exists($oldPath)) {
            unlink($oldPath);
        }

        // Upload new image
        $uploadDir = __DIR__ . "/../uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        // New image name
        $ext = pathinfo($_FILES["gambar"]["name"], PATHINFO_EXTENSION);
        $gambarName = time() . "_" . uniqid() . "." . $ext;
        
        // Move the new image
        move_uploaded_file($_FILES["gambar"]["tmp_name"], $uploadDir . $gambarName);

        $stmt = $koneksi->prepare("UPDATE buku SET judul=?, penulis=?, tahun=?, harga=?, gambar=? WHERE id=?");
        $stmt->bind_param("ssissi", $judul, $penulis, $tahun, $harga, $gambarName, $id);
    } else {
        // If there is no new image
        $data = json_decode(file_get_contents("php://input"), true);

        $judul = $data["judul"] ?? null;
        $penulis = $data["penulis"] ?? null;
        $tahun = intval($data["tahun"] ?? 0);
        $harga = intval($data["harga"] ?? 0);

        $stmt = $koneksi->prepare("UPDATE buku SET judul=?, penulis=?, tahun=?, harga=? WHERE id=?");
        $stmt->bind_param("sssii", $judul, $penulis, $tahun, $harga, $id);
    }

    // Executing and give alert
    $stmt->execute();
    echo json_encode(["message" => "Buku diupdate"]);
    exit;
}

// DELETE - Dlete book
if ($method === "DELETE") {
    // Deleting book by the given id
    $stmt = $koneksi->prepare("DELETE FROM buku WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // Alert
    echo json_encode(["message" => "Buku dihapus"]);
    exit;
}

echo json_encode(["message" => "Method tidak didukung"]);
?>