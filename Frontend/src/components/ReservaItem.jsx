import React from 'react';
import styles from '@/styles/reservas.module.css';

const ReservaItem = ({ item, handleReservar, handleCancelar }) => {
  return (
    <li
      className={`${styles.horarioItem} ${
        item.status === 'reservado' ? styles.reservadoItem : ''
      }`}
    >
      <span
        className={`${styles.status} ${
          item.status === 'disponível' ? styles.disponivel : styles.reservado
        }`}
      ></span>
      <span className={styles.horarioText}>{item.horario}</span>
      {item.status === 'disponível' ? (
        <button
          className={styles.reservarButton}
          onClick={() => handleReservar(item.horario)}
        >
          Reservar
        </button>
      ) : (
        <button
          className={styles.cancelarButton}
          onClick={() => handleCancelar(item.idReserva, item.horario)}
        >
          Cancelar
        </button>
      )}
    </li>
  );
};

export default ReservaItem;
