import React from 'react';

const DataSelector = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <label htmlFor="data">Selecione a Data:</label>
      <input
        type="date"
        id="data"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  );
};

export default DataSelector;
