'use client';
import { useState, useEffect } from 'react';
import LayoutDashboard from '../components/LayoutDashboard';
import styles from '../styles/home.module.css';
import { FaMicrophone, FaDesktop, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#__next');

const HomePage = () => {
  const [environments, setEnvironments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); // Para armazenar o tipo de ambiente selecionado
  const [selectedEnvironments, setSelectedEnvironments] = useState([]); // Para armazenar os ambientes daquele tipo
  const [expandedItem, setExpandedItem] = useState(null); // Para controlar quais detalhes estão expandidos
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redireciona para o login se não estiver autenticado
    } else {
      axios
        .get('http://localhost:8000/environments') // Obtendo os dados do DB JSON
        .then((response) => {
          setEnvironments(response.data); // Armazenando os ambientes no estado
        })
        .catch((error) => {
          console.error('Erro ao buscar dados:', error);
        });
    }
  }, [router]);

  const openModal = (type) => {
    const filteredEnvironments = environments.filter((env) => env.tipo === type);
    setSelectedType(type); // Setando o tipo de ambiente selecionado
    setSelectedEnvironments(filteredEnvironments); // Setando os ambientes daquele tipo
    setModalIsOpen(true); // Abrindo o modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Fechando o modal
    setSelectedEnvironments([]); // Limpando os ambientes selecionados
    setSelectedType(null); // Limpando o tipo selecionado
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Auditório':
        return <FaMicrophone />;
      case 'Laboratório':
        return <FaDesktop />;
      case 'Biblioteca':
        return <FaBook />;
      case 'Sala':
        return <FaChalkboardTeacher />;
      default:
        return <FaBook />;
    }
  };

  const toggleDetails = (item) => {
    console.log('Clicando em:', item); // Verifique se está recebendo o objeto correto
    setExpandedItem(expandedItem?.id === item.id ? null : item); // Altera para null ou o item selecionado
  };

  // Definir tipos únicos de ambientes
  const uniqueTypes = [...new Set(environments.map((env) => env.tipo))];

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
        contentLabel="Environment Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{selectedType}</h2> {/* Título do tipo de ambiente */}
        <div className={styles.environmentList}>
          {selectedEnvironments.map((environment) => (
            <div key={environment.id} className={styles.environmentItem}>
              {/* Exibindo o nome do ambiente */}
              <p>{environment.nome}</p>

              {/* Botão de Ver Detalhes */}
              <button
                onClick={() => toggleDetails(environment)} // Passando o ambiente correto
                className={styles.detailsButton}
              >
                {expandedItem?.id === environment.id
                  ? 'Esconder Detalhes'
                  : 'Ver Detalhes'}
              </button>

              {/* Botão de Reservar */}
              <button className={styles.reserveButton}>Reservar</button>

              {/* Detalhes do ambiente (expandido quando necessário) */}
              {expandedItem?.id === environment.id && (
                <div className={styles.environmentDetails}>
                  <p><strong>Status:</strong> {environment.status}</p>
                  <p><strong>Equipamentos:</strong> {environment.equipamentos}</p>
                  <p><strong>Horário de Início:</strong> {environment.horario_inicio}</p>
                  <p><strong>Horário de Fim:</strong> {environment.horario_fim}</p>
                  <p><strong>Localização:</strong> {environment.localizacao}</p>
                  <p><strong>Descrição:</strong> {environment.descricao}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={closeModal} className={styles.closeButton}>
          Fechar
        </button>
      </Modal>
    </LayoutDashboard>
  );
};

export default HomePage;
