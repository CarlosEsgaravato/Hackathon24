'use client'
import { useState, useEffect } from 'react';
import LayoutDashboard from '../components/LayoutDashboard';
import styles from '../styles/home.module.css'; // Importando o CSS Module
import { FaMicrophone, FaDesktop, FaBook, FaChalkboardTeacher } from 'react-icons/fa'; // Importando ícones do Font Awesome
import Modal from 'react-modal';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#__next');

const iconMap = {
  FaMicrophone: <FaMicrophone />,
  FaDesktop: <FaDesktop />,
  FaBook: <FaBook />,
  FaChalkboardTeacher: <FaChalkboardTeacher />
};

const HomePage = () => {
  const [environments, setEnvironments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/environments')
      .then(response => {
        setEnvironments(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const openModal = (environment) => {
    setSelectedEnvironment(environment);
    setModalIsOpen(true);
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEnvironment(null);
    setExpandedItem(null);
  };

  const toggleDetails = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };
  

  return (
    <LayoutDashboard>
      <h1 className={styles.title}>Agendamento de reservas</h1> {/* Título centralizado */}
      <div className={styles.cardGrid}>
        {environments.map((environment, index) => (
          <div key={index} className={styles.card} onClick={() => openModal(environment)}>
            {iconMap[environment.icon]}
            <h2>{environment.name}</h2>
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
        <h2>{selectedEnvironment?.name}</h2>
        <ul className={styles.itemList}>
          {selectedEnvironment?.items.map((item, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <span>{item.name}</span>
                <div>
                  <button onClick={() => toggleDetails(item)} className={styles.detailsButton}>
                    {expandedItem === item ? 'Esconder Detalhes' : 'Ver Detalhes'}
                  </button>
                  <button className={styles.reserveButton}>Reservar</button>
                </div>
              </div>
              {expandedItem === item && (
                <ItemDetails item={item} />
              )}
            </li>
          ))}
        </ul>
        <button onClick={closeModal} className={styles.closeButton}>Fechar</button>
      </Modal>
    </LayoutDashboard>
  );
};

const ItemDetails = ({ item }) => {
  const style = useSpring({ height: 'auto', from: { height: 0 } });

  return (
    <animated.div style={style} className={styles.itemDetails}>
      <p><strong>Tipo:</strong> {item.tipo}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Equipamentos:</strong> {item.equipamentos}</p>
      <p><strong>Horário de Funcionamento:</strong> {item.horario_funcionamento}</p>
      <p><strong>Localização:</strong> {item.localizacao}</p>
      <p><strong>Descrição:</strong> {item.descricao}</p>
    </animated.div>
  );
};

export default HomePage;
