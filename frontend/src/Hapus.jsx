import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Hapus() {
  const { id } = useParams(); // Taking the id

  useEffect(() => {
    const hapusData = async () => {
      if (window.confirm("Yakin ingin menghapus buku ini?")) { // Alert 
        await axios.delete(`http://localhost:5000/buku/${id}`); // Delete based on the id
        window.location.href = "/"; // Go back to root
      } else {
        window.location.href = "/";
      }
    };

    hapusData();
  }, [id]);

  return <p>Menghapus data...</p>;
}
