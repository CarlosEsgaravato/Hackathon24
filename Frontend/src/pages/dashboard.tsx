import React, { useState, useEffect } from 'react';
import LayoutDashboard from '@/components/LayoutDashboard';
import axios from 'axios';
import styles from '@/styles/dashboard.module.css';

const ListagemReservas = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [ambientes, setAmbientes] = useState<any[]>([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [espacoFiltro, setEspacoFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [reservaParaExcluir, setReservaParaExcluir] = useState<any>(null); 

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservasResponse = await axios.get('http://localhost:8000/api/reservas');
        console.log('Reservas:', reservasResponse.data);

        const usuariosResponse = await axios.get('http://localhost:8000/api/usuarios');
        console.log('Usuários:', usuariosResponse.data);

        const ambientesResponse = await axios.get('http://localhost:8000/api/ambientes');
        console.log('Ambientes:', ambientesResponse.data);

        setReservas(reservasResponse.data);
        setUsuarios(usuariosResponse.data);
        setAmbientes(ambientesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const getUsuarioNome = (userId: number) => {
    const usuario = usuarios.find((u: any) => u.id === userId);
    return usuario ? usuario.usuario : 'Usuário Desconhecido';
  };

  const getAmbienteNome = (ambienteId: number) => {
    const ambiente = ambientes.find((a: any) => a.id === ambienteId);
    return ambiente ? ambiente.nome : 'Ambiente Desconhecido';
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const dataMatch = dataFiltro ? reserva.data === dataFiltro : true;
    const espacoMatch = espacoFiltro ? getAmbienteNome(reserva.ambiente_id).includes(espacoFiltro) : true;
    return dataMatch && espacoMatch;
  });

  const abrirModalDeExclusao = (reserva: any) => {
    setReservaParaExcluir(reserva);
    setIsModalOpen(true);
  };

  const excluirReserva = async () => {
    if (reservaParaExcluir) {
      try {
        await axios.delete('localhost:8000/api/reservas/${reservaParaExcluir.id}');
        setReservas(reservas.filter((reserva) => reserva.id !== reservaParaExcluir.id)); 
        alert('Reserva excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir reserva:', error);
        alert('Erro ao excluir a reserva.');
      } finally {
        setIsModalOpen(false); 
        setReservaParaExcluir(null); 
      }
    }
  };

  return (
    <LayoutDashboard>
      <div className={styles.container}>
        <h1 className={styles.title}>Listagem de Reservas</h1>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filtrar por data</label>
            <input
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filtrar por ambiente</label>
            <input
              type="text"
              value={espacoFiltro}
              onChange={(e) => setEspacoFiltro(e.target.value)}
              className={styles.filterInput}
              placeholder="Digite o nome do ambiente"
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Ambiente</th>
              <th>Horário de Início</th>
              <th>Horário de Fim</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyMessage}>
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.id}</td>
                  <td>{getUsuarioNome(reserva.usuario_id)}</td>
                  <td>{getAmbienteNome(reserva.ambiente_id)}</td>
                  <td>{reserva.horario_inicio}</td>
                  <td>{reserva.horario_fim}</td>
                  <td>{reserva.status}</td>
                  <td>{reserva.data}</td>
                  <td>
                    
                    <button className={styles.deleteButton} onClick={() => abrirModalDeExclusao(reserva)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir esta reserva?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={excluirReserva}>Sim, Excluir</button>
              <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </LayoutDashboard>
  );
};

export default ListagemReservas;