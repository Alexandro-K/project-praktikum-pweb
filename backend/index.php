<?php

//  Allowing all cors making the website available to API domain and all this methods
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

$method = $_SERVER['REQUEST_METHOD']; // Getting method request
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/')); // Manual routing to get the urls

//  If the first url match book, it means we gonna go and use the book from our api folder
if ($path[0] === "buku") {
    require "api/buku.php";
} else {
    echo json_encode(["message" => "Endpoint tidak ditemukan"]);
}
