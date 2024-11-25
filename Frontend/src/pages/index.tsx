"use client";
import { useState, useEffect } from "react";
import LayoutDashboard from "../components/LayoutDashboard";
import styles from "../styles/home.module.css";
import {
  FaMicrophone,
  FaDesktop,
  FaBook,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import axios from "axios";

// Configurar o elemento raiz para o react-modal
Modal.setAppElement("#__next");

const HomePage = () => {
  const [ambientes, setAmbientes] = useState([]); // Alterado de environments para ambientes
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); // Para armazenar o tipo de ambiente selecionado
  const [selectedAmbientes, setSelectedAmbientes] = useState([]); // Alterado para armazenar ambientes
  const [expandedItem, setExpandedItem] = useState(null); // Para controlar quais detalhes estão expandidos
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      router.push("/login"); // Redireciona para o login se não estiver autenticado
    } else {
      axios
        .get("http://localhost:8000/api/ambientes", {
          headers: {
            Authorization: `cookie ${token}`
          }
        })
        .then((response) => {
          setAmbientes(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          console.error("Erro específico:", error.response);
        });
    }
  }, [router]);
  
  

  const openModal = (type) => {
    const filteredAmbientes = ambientes.filter((amb) => amb.tipo === type); // Alterado para ambientes
    setSelectedType(type); // Setando o tipo de ambiente selecionado
    setSelectedAmbientes(filteredAmbientes); // Alterado para ambientes
    setModalIsOpen(true); // Abrindo o modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Fechando o modal
    setSelectedAmbientes([]); // Limpando os ambientes selecionados
    setSelectedType(null); // Limpando o tipo selecionado
  };

  const getIconForType = (type) => {
    switch (type) {
      case "Auditório":
        return <FaMicrophone />;
      case "Laboratório":
        return <FaDesktop />;
      case "Biblioteca":
        return <FaBook />;
      case "Sala":
        return <FaChalkboardTeacher />;
      default:
        return <FaBook />;
    }
  };

  const toggleDetails = (item) => {
    console.log("Clicando em:", item); // Verifique se está recebendo o objeto correto
    setExpandedItem(expandedItem?.id === item.id ? null : item); // Altera para null ou o item selecionado
  };

  // Definir tipos únicos de ambientes
  const uniqueTypes = [...new Set(ambientes.map((amb) => amb.tipo))]; // Alterado para ambientes

  return (
    <LayoutDashboard>
      <h1 className={styles.title}>Agendamento de reservas</h1>
      <div className={styles.cardGrid}>
        {uniqueTypes.map((type) => (
          <div
            key={type}
            className={styles.card}
            onClick={() => openModal(type)}
          >
            {getIconForType(type)} {/* Icone baseado no tipo do ambiente */}
            <h2>{type}</h2> {/* Nome do tipo */}
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ambiente Modal" // Alterado o título
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{selectedType}</h2> {/* Título do tipo de ambiente */}
        <div className={styles.environmentList}>
          {selectedAmbientes.map(
            (
              ambiente // Alterado para ambientes
            ) => (
              <div
                key={ambiente.id}
                className={`${styles.environmentItem} ${expandedItem?.id === ambiente.id ? styles.expanded : ""
                  }`}
              >
                <div className={styles.environmentHeader}>
                  <p>{ambiente.nome}</p>

                  <div>
                    {/* Botão de Ver Detalhes */}
                    <button
                      onClick={() => toggleDetails(ambiente)}
                      className={styles.detailsButton}
                    >
                      {expandedItem?.id === ambiente.id
                        ? "Esconder Detalhes"
                        : "Ver Detalhes"}
                    </button>

                    {/* Botão de Reservar */}
                    <button
                      className={styles.reserveButton}
                      onClick={() => router.push(`/reservas?id=${ambiente.id}`)} // Passa o ID como query
                    >
                      Reservar
                    </button>
                  </div>
                </div>

                {/* Detalhes do ambiente */}
                {expandedItem?.id === ambiente.id && (
                  <div className={styles.environmentDetails}>
                    <p>
                      <strong>Status:</strong>{" "}
                      {ambiente.status || "Não informado"}
                    </p>
                    <p>
                      <strong>Equipamentos:</strong>{" "}
                      {ambiente.equipamentos || "Não informado"}
                    </p>
                    <p>
                      <strong>Horário de Início:</strong>{" "}
                      {ambiente.horario_inicio || "Não informado"}
                    </p>
                    <p>
                      <strong>Horário de Fim:</strong>{" "}
                      {ambiente.horario_fim || "Não informado"}
                    </p>
                    <p>
                      <strong>Localização:</strong>{" "}
                      {ambiente.localizacao || "Não informado"}
                    </p>
                    <p>
                      <strong>Descrição:</strong>{" "}
                      {ambiente.descricao || "Não informado"}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <button onClick={closeModal} className={styles.closeButton}>
          Fechar
        </button>
      </Modal>
    </LayoutDashboard>
  );
};

export default HomePage;
