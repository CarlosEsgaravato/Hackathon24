'use client';

import { useState, useEffect } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import Modal from "react-modal";
import styles from "@/styles/cadastroUsuario.module.css";
import axios from "axios";

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#__next');

const CadastroUsuario = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
    email: "",
    funcao: "usuario",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Carregar lista de usuários
  useEffect(() => {
    axios.get("http://localhost:8000/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Erro ao buscar usuários:", error));
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setFormData(user);
      setEditingUserId(user.id);
    } else {
      setFormData({
        usuario: "",
        senha: "",
        email: "",
        funcao: "usuario",
      });
      setEditingUserId(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      usuario: "",
      senha: "",
      email: "",
      funcao: "usuario",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editingUserId) {
      // Atualizar usuário existente
      axios
        .put(`http://localhost:8000/users/${editingUserId}`, formData)
        .then(() => {
          setUsers((prev) =>
            prev.map((user) => (user.id === editingUserId ? formData : user))
          );
          closeModal();
        })
        .catch((error) => console.error("Erro ao atualizar usuário:", error));
    } else {
      // Criar novo usuário com ID como string incremental
      const newId = users.length > 0 
        ? (Math.max(...users.map((u) => parseInt(u.id))) + 1).toString() 
        : "1";
  
      const newUser = { ...formData, id: newId };
  
      axios
        .post("http://localhost:8000/users", newUser)
        .then((response) => {
          setUsers((prev) => [...prev, response.data]);
          closeModal();
        })
        .catch((error) => console.error("Erro ao criar usuário:", error));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((error) => console.error("Erro ao excluir usuário:", error));
  };
  

  return (
    <LayoutDashboard>
      <div className={styles.container}>
        <h1>Cadastro de Usuários</h1>
        <button onClick={() => openModal()} className={styles.addButton}>
          + Novo Usuário
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.usuario}</td>
                <td>{user.email}</td>
                <td>{user.funcao}</td>
                <td>
                  <button
                    onClick={() => openModal(user)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Cadastro de Usuário"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>{editingUserId ? "Editar Usuário" : "Novo Usuário"}</h2>
          <form className={styles.form}>
            <label>
              Usuário:
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Senha:
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Função:
              <select
                name="funcao"
                value={formData.funcao}
                onChange={handleInputChange}
              >
                <option value="usuario">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handleSave}>
                Salvar
              </button>
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </LayoutDashboard>
  );
};

export default CadastroUsuario;
