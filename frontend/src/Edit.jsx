import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Edit() {
  //  Taking the id and creating new forms
  const { id } = useParams();
  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    tahun: "",
    harga: "",
    gambar: ""
  });

  // Creating a state of states
  const [gambar, setGambar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the book data based on the id
  useEffect(() => {
    axios
      .get("http://localhost:5000/buku")
      .then((res) => {
        const data = res.data.find((b) => parseInt(b.id) === parseInt(id));
        if (data) {
          setForm({
            judul: data.judul || "",
            penulis: data.penulis || "",
            tahun: data.tahun || "",
            harga: data.harga || "",
            gambar: data.gambar || ""
          });
        }
        setLoading(false);
      })
      // If error occured
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data buku");
        setLoading(false);
      });
  }, [id]);

  // Handle change input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handling change on file
  const handleFileChange = (e) => {
    setGambar(e.target.files[0] || null);
  };

  // Updating the data from user
  const update = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (gambar) {
        // If there is an image use FormData()
        const formData = new FormData();
        formData.append("judul", form.judul);
        formData.append("penulis", form.penulis);
        formData.append("tahun", form.tahun);
        formData.append("harga", form.harga);
        formData.append("gambar", gambar);

        console.log("Sending FormData with file...");
        const response = await axios.put(
          `http://localhost:5000/buku/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        console.log("Response:", response.data);
      } else {
        // If there are no new image, use JSON form data
        console.log("Sending JSON data...");
        const response = await axios.put(
          `http://localhost:5000/buku/${id}`,
          {
            judul: form.judul,
            penulis: form.penulis,
            tahun: parseInt(form.tahun),
            harga: parseInt(form.harga)
          }
        );
        console.log("Response:", response.data);
      }

      alert("Buku berhasil diupdate!");
      window.location.href = "/";
    } catch (err) {
      console.error("Error updating:", err);
      setError("Gagal mengupdate buku: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Returning the new form for user edit
  return (
    <form onSubmit={update}>
      <h2>Edit Buku</h2>

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
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {form.gambar && !gambar && (
          <p>Gambar saat ini: <strong>{form.gambar}</strong></p>
        )}
        {gambar && <p>Gambar baru akan diunggah: <strong>{gambar.name}</strong></p>}
      </div>

      <button type="submit">SIMPAN</button>
    </form>
  );
}