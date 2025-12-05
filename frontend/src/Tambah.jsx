import { useState } from "react";
import axios from "axios";

export default function Tambah() {
  //  Empty form
  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    tahun: "",
    harga: ""
  });

  const [gambar, setGambar] = useState(null); // A state to save image

  //  Same change to help handling change on the form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value }); 

  const simpan = async (e) => {
    e.preventDefault(); // Prevent refresh

    const data = new FormData(); // Creating new form
    Object.keys(form).forEach((key) => data.append(key, form[key])); // Appending the data to the form
    if (gambar) data.append("gambar", gambar); // Appending the image

    await axios.post("http://localhost:5000/buku", data); // Sending data to POST route and saving the data to /uploads
    window.location.href = "/";
  };

  return (
    <form onSubmit={simpan}>
      <h2>Tambah Buku</h2>

      {/* Input for adding book */}
      <input name="judul" placeholder="Judul" onChange={handleChange} />
      <input name="penulis" placeholder="Penulis" onChange={handleChange} />
      <input name="tahun" type="number" placeholder="Tahun" onChange={handleChange} />
      <input name="harga" type="number" placeholder="Harga" onChange={handleChange} />
      <input type="file" onChange={(e) => setGambar(e.target.files[0])} />

      <button>SIMPAN</button>
    </form>
  );
}
