import React from 'react';
import ReservaItem from './ReservaItem';

const HorarioList = ({ horarios, handleReservar, handleCancelar }) => {
  return (
    <div>
      <h2>Horários Disponíveis</h2>
      <ul>
        {horarios.map((item, index) => (
          <ReservaItem
            key={index}
            item={item}
            handleReservar={handleReservar}
            handleCancelar={handleCancelar}
          />
        ))}
      </ul>
    </div>
  );
};

export default HorarioList;
