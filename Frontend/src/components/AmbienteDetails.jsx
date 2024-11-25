import React from 'react';

const AmbienteDetails = ({ ambiente }) => {
  return (
    <div>
      <h2>{ambiente.nome}</h2>
      <p>
        <strong>Horário de Funcionamento:</strong>{' '}
        {`${ambiente.horario_inicio} - ${ambiente.horario_fim}`}
      </p>
      <p>
        <strong>Descrição:</strong> {ambiente.descricao || 'N/A'}
      </p>
    </div>
  );
};

export default AmbienteDetails;
