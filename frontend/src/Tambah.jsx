import { useState } from "react";
import axios from "axios";

export default function Tambah() {
  //  Creating new form
  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    tahun: "",
    harga: ""
  });

  // Creating set of state
  const [gambar, setGambar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handling change on the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handling image in form
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.size);
      setGambar(file);
    }
  };

  // Saving the data
  const simpan = async (e) => {
    e.preventDefault(); // Prevent refresh
    setError("");
    setLoading(true);

    try {
      // Try to appending the data 
      const formData = new FormData();
      formData.append("judul", form.judul);
      formData.append("penulis", form.penulis);
      formData.append("tahun", form.tahun);
      formData.append("harga", form.harga);
      
      // If there is an image, append the image
      if (gambar) {
        formData.append("gambar", gambar);
        console.log("File appended to FormData:", gambar.name);
      }

      // Debug: log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Post 
      const response = await axios.post("http://localhost:5000/buku", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // Response & Alert
      console.log("Upload response:", response.data);
      alert("Buku berhasil ditambahkan!");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
    // If error occured
    catch (err) {
      console.error("Error during upload:", err);
      setError(
        "Gagal menambahkan buku: " + 
        (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  //  Returning the form to the frontend for user 
  return (
    <form onSubmit={simpan}>
      <h2>Tambah Buku</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Judul:</label>
        <input
          name="judul"
          placeholder="Judul"
          value={form.judul}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Penulis:</label>
        <input
          name="penulis"
          placeholder="Penulis"
          value={form.penulis}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Tahun:</label>
        <input
          name="tahun"
          type="number"
          placeholder="Tahun"
          value={form.tahun}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Harga:</label>
        <input
          name="harga"
          type="number"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Gambar:</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        {gambar && <p>File dipilih: <strong>{gambar.name}</strong></p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "SIMPAN"}
      </button>
    </form>
  );
}