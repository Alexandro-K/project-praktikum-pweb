import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function App() {
  const [buku, setBuku] = useState([]);

  const getBuku = async () => {
    const res = await axios.get("http://localhost:5000/buku"); // Taking all the books using params
    setBuku(res.data); // Set the state using the response
  };

  //  Run this once the page is loaded
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/buku"); // Taking all the books using params
      setBuku(res.data); // Set the state using the response
    };
    fetchData();
  }, []);


  const hapusBuku = async (id) => {
    if (window.confirm("Hapus buku ini?")) { // Alert
      await axios.delete(`http://localhost:5000/buku/${id}`); // Sending the data about the deleted book id
      getBuku(); // getBuku() is called to refresh the newest list
    }
  };

  return (
    <div className="container">
      <h1>Toko Buku</h1> 
      {/* Connect the Add book button to Add Page */}
      <a href="/Tambah" className="btn-tambah">+ Tambah Buku</a> 

      <div className="grid">
        {buku.map((b) => ( // Mapping all the books
          <div className="card" key={b.id}>

            {/* Showing the image */}
            <img
              src={
                b.gambar
                  ? `http://localhost:5000/uploads/${b.gambar}`
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
            />

            {/* Showing the title, authors with year, price, edit and the delete button */}
            <h3>{b.judul}</h3>
            <p>By {b.penulis} ({b.tahun})</p>
            <p className="harga">Rp {Number(b.harga).toLocaleString()}</p>

            <div className="btn-container">
              {/* Connect the edit button to edit page with given id */}
              <a href={`/edit/${b.id}`} className="btn edit">Edit</a> 
              {/* Connect the delete button to delete page with given id */}
              <button className="btn hapus" onClick={() => hapusBuku(b.id)}>Hapus</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}