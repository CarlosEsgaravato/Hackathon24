'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from '@/styles/reservas.module.css';
import LayoutDashboard from '@/components/LayoutDashboard';

const Reservas = () => {
  const searchParams = useSearchParams();
  const ambienteId = searchParams.get('id'); // Obtendo o ID do ambiente pela URL

  const [ambiente, setAmbiente] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(''); // Usuário selecionado
  const [reservas, setReservas] = useState([]); // Para armazenar as reservas existentes
  const [usuarios, setUsuarios] = useState([]); // Para armazenar os usuários

  useEffect(() => {
    // Carregar a lista de usuários
    axios
      .get('http://localhost:8000/api/usuarios')
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar usuários:', error);
      });

    if (ambienteId) {
      // Busca os detalhes do ambiente
      axios
        .get(`http://localhost:8000/api/ambientes/${ambienteId}`)
        .then((response) => {
          setAmbiente(response.data.data);
        })
        .catch((error) => {
          console.error('Erro ao carregar ambiente:', error);
        });
    }

    // Carregar todas as reservas existentes
    axios
      .get(`http://localhost:8000/api/reservas`)
      .then((response) => {
        setReservas(response.data.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar reservas:', error);
      });
  }, [ambienteId]);

  useEffect(() => {
    if (selectedDate && ambiente) {
      const horariosGerados = gerarHorarios(
        ambiente.horario_inicio,
        ambiente.horario_fim
      );

      axios
        .get(
          `http://localhost:8000/api/reservas?ambiente=${ambiente.nome}&data=${selectedDate}`
        )
        .then((response) => {
          const reservas = response.data.data;

          const horariosAtualizados = horariosGerados.map((h) => {
            const reserva = reservas?.find(
              (r) => r.horario_inicio === h.horario.split(' - ')[0]
            );

            return {
              ...h,
              status: reserva ? 'reservado' : 'disponível',
            };
          });

          setHorarios(horariosAtualizados);
        })
        .catch((error) => {
          console.error('Erro ao carregar reservas:', error);
        });
    }
  }, [selectedDate, ambiente]);

  const gerarHorarios = (inicio, fim) => {
    const horariosGerados = [];
    let current = new Date(`2023-01-01T${inicio}`);
    const end = new Date(`2023-01-01T${fim}`);
    while (current < end) {
      const next = new Date(current.getTime() + 60 * 60 * 1000);
      horariosGerados.push({
        horario: `${current.toTimeString().slice(0, 5)} - ${next
          .toTimeString()
          .slice(0, 5)}`,
        status: 'disponível',
      });
      current = next;
    }
    return horariosGerados;
  };

  const handleReservar = (horario) => {
    const [inicio, fim] = horario.split(' - ');

    if (!selectedUserId) {
      alert('Selecione um usuário para realizar a reserva.');
      return;
    }

    const maiorIdReserva = Math.max(...(reservas || []).map((r) => parseInt(r.id)), 0);
    const novoId = (maiorIdReserva + 1).toString(); // Incrementar o ID

    axios
      .post('http://localhost:8000/api/reservas', {
        id: novoId,
        usuario_id: selectedUserId, // Usar o ID do usuário selecionado
        ambiente_id: ambiente.id,
        horario_inicio: inicio,
        horario_fim: fim,
        statusReserva: 'reservado',
        status: 'ativo',
        data: selectedDate,
      })
      .then(() => {
        alert(`Reserva realizada para o horário: ${horario}`);
        setHorarios((prevHorarios) =>
          prevHorarios.map((h) =>
            h.horario === horario ? { ...h, status: 'reservado' } : h
          )
        );

        setReservas((prevReservas) => [
          ...(prevReservas || []),
          {
            id: novoId,
            usuario_id: selectedUserId,
            ambiente_id: ambiente.id,
            horario_inicio: inicio,
            horario_fim: fim,
            statusReserva: 'reservado',
            status: 'ativo',
            data: selectedDate,
          },
        ]);
      })
      .catch((error) => console.error('Erro ao realizar reserva:', error));
  };

  return (
    <LayoutDashboard>
      <div className={styles.container}>
        <h1 className={styles.title}>Reservas de Ambientes</h1>

        {ambiente && (
          <>
            <div className={styles.ambienteDetails}>
              <h2>{ambiente.nome}</h2>
              <p>
                <strong>Horário de Funcionamento:</strong>{' '}
                {`${ambiente.horario_inicio} - ${ambiente.horario_fim}`}
              </p>
              <p>
                <strong>Descrição:</strong> {ambiente.descricao || 'N/A'}
              </p>
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

            <div className={styles.formGroup}>
              <label htmlFor="usuario">Selecione o Usuário:</label>
              <select
                id="usuario"
                className={styles.input}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecione</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div className={styles.horariosContainer}>
                <h2 className={styles.subTitle}>Horários Disponíveis</h2>
                <ul className={styles.horariosList}>
                  {horarios.map((item, index) => (
                    <li
                      key={index}
                      className={`${styles.horarioItem} ${
                        item.status === 'reservado'
                          ? styles.reservadoItem
                          : ''
                      }`}
                    >
                      <span
                        className={`${styles.status} ${
                          item.status === 'disponível'
                            ? styles.disponivel
                            : styles.reservado
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
                        <span className={styles.reservadoText}>
                          Reservado
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default Reservas;
