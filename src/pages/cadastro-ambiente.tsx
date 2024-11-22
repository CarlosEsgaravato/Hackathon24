'use client';

import { useState, useEffect } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import Modal from "react-modal";
import styles from "@/styles/cadastroAmbiente.module.css";
import axios from "axios";

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#__next');

const CadastroAmbiente = () => {
  const [environments, setEnvironments] = useState([]);
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
  const [editingEnvironmentId, setEditingEnvironmentId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/environments")
      .then(response => {
        console.log("Ambientes carregados:", response.data);
        setEnvironments(response.data);
      })
      .catch(error => console.error("Erro ao buscar ambientes:", error));
  }, []);
  

  const openModal = (environment = null) => {
    if (environment) {
      setFormData(environment);
      setEditingEnvironmentId(environment.id);
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
      setEditingEnvironmentId(null);
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
    if (editingEnvironmentId) {
      // Atualizar ambiente existente
      axios
        .put(`http://localhost:8000/environments/${editingEnvironmentId}`, formData)
        .then(() => {
          setEnvironments((prev) =>
            prev.map((env) => (env.id === editingEnvironmentId ? formData : env))
          );
          closeModal();
        })
        .catch((error) => console.error("Erro ao atualizar ambiente:", error));
    } else {
      // Criar novo ambiente, sem necessidade de id manual
      axios
        .post("http://localhost:8000/environments", formData) // O ID será gerado automaticamente pelo JSON Server
        .then((response) => {
          setEnvironments((prev) => [...prev, response.data]);
          closeModal();
        })
        .catch((error) => console.error("Erro ao criar ambiente:", error));
    }
  };
  

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/environments/${id}`)
      .then(() => {
        setEnvironments((prev) => prev.filter((env) => env.id !== id));
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
            {environments.map((env) => (
              <tr key={env.id}>
                <td>{env.id}</td>
                <td>{env.nome}</td>
                <td>{env.tipo}</td>
                <td>{env.status}</td>
                <td>{env.equipamentos}</td>
                <td>{`${env.horario_inicio} - ${env.horario_fim}`}</td>
                <td>{env.localizacao}</td>
                <td>{env.descricao}</td>
                <td>
                  <button
                    onClick={() => openModal(env)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(env.id)}
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
        <h2>{editingEnvironmentId ? "Editar Ambiente" : "Novo Ambiente"}</h2>
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
