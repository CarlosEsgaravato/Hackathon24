'use client';

import { useState, useEffect } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import Modal from "react-modal";
import styles from "@/styles/cadastroAmbiente.module.css";
import axios from "axios";

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#__next');

const CadastroAmbiente = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "Lab",
    status: "Disponivel",
    equipamentos: "",
    horario_inicio: "",
    horario_fim: "",
    localizacao: "",
    descricao: ""
  });
  const [editingAmbienteId, setEditingAmbienteId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/ambientes")
      .then(response => {
        console.log("Ambientes carregados:", response.data);
        setAmbientes(response.data);
      })
      .catch(error => console.error("Erro ao buscar ambientes:", error));
  }, []);

  const openModal = (ambiente = null) => {
    if (ambiente) {
      setFormData(ambiente);
      setEditingAmbienteId(ambiente.id);
    } else {
      setFormData({
        nome: "",
        tipo: "Lab",
        status: "Disponivel",
        equipamentos: "",
        horario_inicio: "",
        horario_fim: "",
        localizacao: "",
        descricao: ""
      });
      setEditingAmbienteId(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      nome: "",
      tipo: "Lab",
      status: "Disponivel",
      equipamentos: "",
      horario_inicio: "",
      horario_fim: "",
      localizacao: "",
      descricao: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editingAmbienteId) {
      axios
        .put(`http://localhost:8000/ambientes/${editingAmbienteId}`, formData)
        .then(() => {
          setAmbientes((prev) =>
            prev.map((ambiente) => (ambiente.id === editingAmbienteId ? formData : ambiente))
          );
          closeModal();
        })
        .catch((error) => console.error("Erro ao atualizar ambiente:", error));
    } else {
      axios
        .post("http://localhost:8000/ambientes", formData)
        .then((response) => {
          setAmbientes((prev) => [...prev, response.data]);
          closeModal();
        })
        .catch((error) => console.error("Erro ao criar ambiente:", error));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/ambientes/${id}`)
      .then(() => {
        setAmbientes((prev) => prev.filter((ambiente) => ambiente.id !== id));
      })
      .catch((error) => console.error("Erro ao excluir ambiente:", error));
  };

  return (
    <LayoutDashboard>
      <div className={styles.container}>
        <h1>Cadastro de Ambientes</h1>
        <button onClick={() => openModal()} className={styles.addButton}>
          + Novo Ambiente
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Equipamentos</th>
              <th>Horário</th>
              <th>Localização</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ambientes.map((ambiente) => (
              <tr key={ambiente.id}>
                <td>{ambiente.id}</td>
                <td>{ambiente.nome}</td>
                <td>{ambiente.tipo}</td>
                <td>{ambiente.status}</td>
                <td>{ambiente.equipamentos}</td>
                <td>{`${ambiente.horario_inicio} - ${ambiente.horario_fim}`}</td>
                <td>{ambiente.localizacao}</td>
                <td className={styles.descriptionCell} data-description={ambiente.descricao}>
                  {ambiente.descricao}
                </td>
                <td>
                  <button
                    onClick={() => openModal(ambiente)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ambiente.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Cadastro de Ambiente"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{editingAmbienteId ? "Editar Ambiente" : "Novo Ambiente"}</h2>
        <form className={styles.form}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleInputChange}
          />
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
          >
            <option value="Lab">Laboratório</option>
            <option value="Sala">Sala</option>
            <option value="Auditório">Auditório</option>
            <option value="Biblioteca">Biblioteca</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Disponivel">Disponível</option>
            <option value="Indisponivel">Indisponível</option>
            <option value="Manutencao">Manutenção</option>
          </select>
          <input
            type="text"
            name="equipamentos"
            placeholder="Equipamentos"
            value={formData.equipamentos}
            onChange={handleInputChange}
          />
          <div className={styles.timeInputs}>
            <input
              type="time"
              name="horario_inicio"
              value={formData.horario_inicio}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="horario_fim"
              value={formData.horario_fim}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="text"
            name="localizacao"
            placeholder="Localização"
            value={formData.localizacao}
            onChange={handleInputChange}
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={closeModal}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        </form>
      </Modal>
    </LayoutDashboard>
  );
};

export default CadastroAmbiente;
