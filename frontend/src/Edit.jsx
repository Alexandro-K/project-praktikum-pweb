import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Edit() {
  const { id } = useParams(); // Take id from the url
  const [form, setForm] = useState({}); // Placeholder for the old data
  const [gambar, setGambar] = useState(null); // Placeholder to take the new image input


  useEffect(() => {
    axios.get("http://localhost:5000/buku").then((res) => {
      const data = res.data.find((b) => b.id == id); // Finding the same id with the id in the url
      setForm(data); // Setting the current form with exist data
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value }); // Using the input user for changing the same input on the html

  const update = async (e) => {
    e.preventDefault(); // Stop refresh

    const data = new FormData();  // New form to send the new data and image
    
    //  Appending the new data to the form 
    Object.keys(form).forEach((key) => data.append(key, form[key])); 
    if (gambar) data.append("gambar", gambar);

    // Update the database and put the url to the root
    await axios.put(`http://localhost:5000/buku/${id}`, data);
    window.location.href = "/";
  };

  return (
    <form onSubmit={update}>
      <h2>Edit Buku</h2>

      {/*  This is the place where the form get the initial data */}
      <input name="judul" value={form.judul || ""} onChange={handleChange} />
      <input name="penulis" value={form.penulis || ""} onChange={handleChange} />
      <input name="tahun" value={form.tahun || ""} type="number" onChange={handleChange} />
      <input name="harga" value={form.harga || ""} type="number" onChange={handleChange} />
      <input type="file" onChange={(e) => setGambar(e.target.files[0])} />

      <button>SIMPAN</button>
    </form>
  );
}
