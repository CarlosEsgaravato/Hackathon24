'use client';

import React, { useState } from "react";
import styles from "@/styles/reservas.module.css";
import LayoutDashboard from "@/components/LayoutDashboard";

const Reservas = () => {
  const [selectedAmbiente, setSelectedAmbiente] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [horarios, setHorarios] = useState([
    { horario: "08:00 - 08:30", status: "disponível" },
    { horario: "08:30 - 09:00", status: "reservado" },
    { horario: "09:00 - 09:30", status: "disponível" },
  ]);

  const handleReservar = (horario) => {
    alert(`Reserva realizada para o horário: ${horario}`);
  };

  return (
    <LayoutDashboard>
      <div className={styles.container}>
        <h1 className={styles.title}>Reservas de Ambientes</h1>

        <div className={styles.formGroup}>
          <label htmlFor="ambiente">Selecione o Ambiente:</label>
          <select
            id="ambiente"
            className={styles.select}
            value={selectedAmbiente}
            onChange={(e) => setSelectedAmbiente(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Lab 01">Lab 01</option>
            <option value="Auditório 1">Auditório 1</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="data">Selecione a Data:</label>
          <input
            type="date"
            id="data"
            className={styles.input}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className={styles.horariosContainer}>
          <h2 className={styles.subTitle}>Horários Disponíveis</h2>
          <ul className={styles.horariosList}>
            {horarios.map((item, index) => (
              <li key={index} className={styles.horarioItem}>
                <span
                  className={`${styles.status} ${
                    item.status === "disponível"
                      ? styles.disponivel
                      : styles.reservado
                  }`}
                ></span>
                <span>{item.horario}</span>
                {item.status === "disponível" && (
                  <button
                    className={styles.reservarButton}
                    onClick={() => handleReservar(item.horario)}
                  >
                    Reservar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default Reservas;
