<?php

// Connection to database
$koneksi = mysqli_connect("localhost", "root", "", "project_pweb");

// If connection failed
if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
?>
