'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import AmbienteDetails from '@/components/AmbienteDetails';
import DataSelector from '@/components/DataSelector';
import HorarioList from '@/components/HorarioList';
import LayoutDashboard from '@/components/LayoutDashboard';

const Reservas = () => {
  const searchParams = useSearchParams();
  const ambienteId = searchParams.get('id');

  const [ambiente, setAmbiente] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (ambienteId) {
      axios
        .get(`http://localhost:8000/api/ambientes/${ambienteId}`)
        .then((response) => setAmbiente(response.data.data))
        .catch((error) => console.error('Erro ao carregar ambiente:', error));
    }

    // axios
    //   .get('http://localhost:8000/api/usuarios')
    //   .then((response) => {
    //     setUsuarios(response.data.data);
    //     const usuario = response.data.find((u) => u.usuario === 'user');
    //     setUsuarioLogado(usuario);
    //   })
    //   .catch((error) => console.error('Erro ao carregar usuários:', error));

    axios
      .get(`http://localhost:8000/api/reservas`)
      .then((response) => setReservas(response.data.data))
      .catch((error) => console.error('Erro ao carregar reservas:', error));
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
          const reservas = response.data;
          const horariosAtualizados = horariosGerados.map((h) => {
            const horarioInicio = h.horario.split(' - ')[0];
            const reserva = reservas.find((r) => r.horario_inicio === horarioInicio);
            return {
              ...h,
              status: reserva ? 'reservado' : 'disponível',
              idReserva: reserva?.id,
              usuarioReserva: reserva?.usuario_id,
            };
          });

          setHorarios(horariosAtualizados);
        })
        .catch((error) => console.error('Erro ao carregar reservas:', error));
    }
  }, [selectedDate, ambiente]);

  const gerarHorarios = (inicio, fim) => {
    const horariosGerados = [];
    let current = new Date(`2023-01-01T${inicio}:00`);
    const end = new Date(`2023-01-01T${fim}:00`);
    while (current < end) {
      const next = new Date(current.getTime() + 60 * 60 * 1000);
      horariosGerados.push({
        horario: `${current.toTimeString().slice(0, 5)} - ${next.toTimeString().slice(0, 5)}`,
        status: 'disponível',
      });
      current = next;
    }
    return horariosGerados;
  };

  const handleReservar = (horario) => {
    const [inicio, fim] = horario.split(' - ');

    if (!usuarioLogado) {
      alert('Você precisa estar logado para fazer uma reserva');
      return;
    }

    axios
      .post('http://localhost:8000/api/reservas', {
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
          { usuario_id: usuarioLogado.id, ambiente: ambiente.nome, horario_inicio: inicio, horario_fim: fim, data: selectedDate }
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
            h.idReserva === idReserva ? { ...h, status: 'disponível', usuarioReserva: null } : h
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
      <div>
        <h1>Reservas de Ambientes</h1>

        {ambiente && (
          <>
            <AmbienteDetails ambiente={ambiente} />
            <DataSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            {selectedDate && (
              <HorarioList horarios={horarios} handleReservar={handleReservar} handleCancelar={handleCancelar} />
            )}
          </>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default Reservas;
