import { useState } from "react";
import { createAgency } from "../services/api";

function Addagency() {
  const [agency, setAgency] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAgency({ ...agency, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await createAgency(agency);
      if (response.status === 201 || response.status === 200) {
        setMessage("Agência adicionada com sucesso!");
        setAgency({ name: "", email: "", phone: "" });
      } else {
        setMessage("Erro ao adicionar agência.");
      }
    } catch (error) {
      if (error.response) {
        setMessage(`Erro: ${error.response.data?.message || "Erro no servidor"}`);
      } else {
        setMessage("Erro de rede: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Agência</h2>
      <div>
        <label>Nome:</label>
        <input type="text" name="name" value={agency.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={agency.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Telefone:</label>
        <input type="text" name="phone" value={agency.phone} onChange={handleChange} required />
      </div>
      <button type="submit">Salvar</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Addagency;
