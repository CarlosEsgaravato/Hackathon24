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
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Agora precisamos garantir que o usuário logado seja identificado corretamente
  const [reservas, setReservas] = useState([]); // Para armazenar as reservas existentes
  const [usuarios, setUsuarios] = useState([]); // Para armazenar os usuários

  useEffect(() => {
    console.log('Ambiente ID:', ambienteId); // Log para depurar o ID
  
    axios
      .get('http://localhost:8000/api/usuarios')
      .then((response) => {
        setUsuarios(response.data);
        const usuario = response.data.find((u) => u.usuario === 'user'); // Exemplo: usuário com nome "user"
        setUsuarioLogado(usuario); // Define o usuário logado com base no nome
      })
      .catch((error) => {
        console.error('Erro ao carregar usuários:', error);
      });
  
    if (ambienteId) {
      axios
        .get(`http://localhost:8000/api/ambientes/${ambienteId}`)
        .then((response) => {
          console.log('Resposta da API:', response.data); // Log para depurar a resposta
          console.log('Horário de Início:', response.data.data.horario_inicio); // Log para depurar horário de início
          console.log('Horário de Fim:', response.data.data.horario_fim); // Log para depurar horário de fim
          setAmbiente(response.data.data);
        })
        .catch((error) => {
          console.error('Erro ao carregar ambiente:', error);
        });
    }
  
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
          console.log('Reservas no horário selecionado:', reservas); // Log para depurar as reservas

          const horariosAtualizados = horariosGerados.map((h) => {
            const reserva = reservas.find(
              (r) => r.horario_inicio === h.horario.split(' - ')[0]
            );

            return {
              ...h,
              status: reserva ? 'reservado' : 'disponível',
              idReserva: reserva?.id,
              usuarioReserva: reserva?.usuario_id,
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
    let current = new Date(`2023-01-01T${inicio}:00`);
    const end = new Date(`2023-01-01T${fim}:00`);
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

    const maiorIdReserva = Math.max(...reservas.map((r) => parseInt(r.id)), 0);
    const novoId = (maiorIdReserva + 1).toString();

    if (!usuarioLogado) {
      alert('Você precisa estar logado para fazer uma reserva');
      return;
    }

    axios
      .post('http://localhost:8000/api/reservas', {
        id: novoId,
        usuario_id: usuarioLogado.id,
        ambiente: ambiente.nome,
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
            h.horario === horario
              ? { ...h, status: 'reservado', usuarioReserva: usuarioLogado.usuario }
              : h
          )
        );

        setReservas((prevReservas) => [
          ...prevReservas,
          {
            id: novoId,
            usuario_id: usuarioLogado.id,
            ambiente: ambiente.nome,
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

  const handleCancelar = (idReserva, horario) => {
    axios
      .delete(`http://localhost:8000/api/reservas/${idReserva}`)
      .then(() => {
        alert(`Reserva cancelada para o horário: ${horario}`);
        setHorarios((prevHorarios) =>
          prevHorarios.map((h) =>
            h.idReserva === idReserva
              ? { ...h, status: 'disponível', usuarioReserva: null }
              : h
          )
        );

        setReservas((prevReservas) =>
          prevReservas.filter((r) => r.id !== idReserva)
        );
      })
      .catch((error) => console.error('Erro ao cancelar reserva:', error));
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
                      ) : item.usuarioReserva === usuarioLogado?.id ? (
                        <button
                          className={styles.cancelarButton}
                          onClick={() => handleCancelar(item.idReserva, item.horario)}
                        >
                          Cancelar Reserva
                        </button>
                      ) : (
                        <span className={styles.reservadoText}>
                          Reservado por {item.usuarioReserva}
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
