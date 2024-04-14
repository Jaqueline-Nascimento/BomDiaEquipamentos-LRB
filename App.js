import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    gerencia: '',
    data: '',
    rocadeiras: {
      turnos: [
        { turno: 'Turno 1', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 2', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 3', operando: 0, locais: [], disponiveis: 0 }
      ],
      oficina: 0,
      quebradas: 0
    },
    sopradores: {
      turnos: [
        { turno: 'Turno 1', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 2', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 3', operando: 0, locais: [], disponiveis: 0 }
      ],
      oficina: 0,
      quebradas: 0
    },
    motopodas: {
      turnos: [
        { turno: 'Turno 1', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 2', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 3', operando: 0, locais: [], disponiveis: 0 }
      ],
      oficina: 0,
      quebradas: 0
    },
    motosserras: {
      turnos: [
        { turno: 'Turno 1', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 2', operando: 0, locais: [], disponiveis: 0 },
        { turno: 'Turno 3', operando: 0, locais: [], disponiveis: 0 }
      ],
      oficina: 0,
      quebradas: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGeneralChange = (equipment, field, index, value) => {
    if (index === -1) { // Direto no objeto de equipamento
      setFormData(prevState => ({
        ...prevState,
        [equipment]: {
          ...prevState[equipment],
          [field]: parseInt(value, 10)
        }
      }));
    } else { // Dentro dos turnos
      const newData = formData[equipment].turnos.map((item, idx) => {
        if (idx === index) {
          let newItem = { ...item, [field]: parseInt(value, 10) };
          if (field === 'operando') {
            newItem.locais = new Array(parseInt(value, 10)).fill('');
          }
          return newItem;
        }
        return item;
      });
  
      setFormData(prevState => ({
        ...prevState,
        [equipment]: {
          ...prevState[equipment],
          turnos: newData
        }
      }));
    }
  };
  

  const handleLocalChange = (equipment, turnIndex, locIndex, value) => {
    const updatedLocals = formData[equipment].turnos.map((turn, tIndex) => {
      if (tIndex === turnIndex) {
        const newLocals = turn.locais.map((local, lIndex) => {
          return lIndex === locIndex ? value : local;
        });
        return { ...turn, locais: newLocals };
      }
      return turn;
    });

    setFormData(prevState => ({
      ...prevState,
      [equipment]: {
        ...prevState[equipment],
        turnos: updatedLocals
      }
    }));
  };

  const renderQuotaTable = () => {
    if (formData.gerencia) {
      const quotas = {
        BG16F: { roçadeira: 17, soprador: 10, motopoda: 1, motosserra: 0 },
        BG16J: { roçadeira: 17, soprador: 10, motopoda: 1, motosserra: 0 },
        BG24B: { roçadeira: 31, soprador: 11, motopoda: 1, motosserra: 0 },
        BG24R: { roçadeira: 29, soprador: 11, motopoda: 1, motosserra: 0 },
        BGE: { roçadeira: 20, soprador: 18, motopoda: 1, motosserra: 6 }
      }[formData.gerencia];

      return (
        <table className="quota-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Cota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Roçadeira</td>
              <td>{quotas.roçadeira}</td>
            </tr>
            <tr>
              <td>Soprador</td>
              <td>{quotas.soprador}</td>
            </tr>
            <tr>
              <td>Motopoda</td>
              <td>{quotas.motopoda}</td>
            </tr>
            <tr>
              <td>Motosserra</td>
              <td>{quotas.motosserra}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return null;
  };

  const renderEquipmentSection = (equipmentName, equipmentData) => (
    <div>
      <h1 className="title">{equipmentName.toUpperCase()}</h1>
      <label>Oficina:
        <input type="number" value={equipmentData.oficina} onChange={(e) => handleGeneralChange(equipmentName, 'oficina', -1, e.target.value)} />
      </label>
      <label>Quebradas na Gerência:
        <input type="number" value={equipmentData.quebradas} onChange={(e) => handleGeneralChange(equipmentName, 'quebradas', -1, e.target.value)} />
      </label>
      <div className="equipment-layout">
        {equipmentData.turnos.map((turn, index) => (
          <div key={index} className="turno-section">
            <h3>{turn.turno}</h3>
            <label>
              Disponíveis na Gerência:
              <input type="number" value={turn.disponiveis} onChange={(e) => handleGeneralChange(equipmentName, 'disponiveis', index, e.target.value)} />
            </label>
            <label>
              Quantidade Operando:
              <input type="number" value={turn.operando} onChange={(e) => handleGeneralChange(equipmentName, 'operando', index, e.target.value)} />
            </label>
            {turn.locais.map((local, locIndex) => (
              <label key={locIndex}>
                Local {locIndex + 1} Operando:
                <input type="text" value={local} onChange={(e) => handleLocalChange(equipmentName, index, locIndex, e.target.value)} />
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="main-title">BOM DIA EQUIPAMENTOS - LRB</h1>
      <div className="form-group">
        <label>
          Gerência:
          <select name="gerencia" value={formData.gerencia} onChange={handleChange}>
            <option value="">Selecione uma Gerência</option>
            <option value="BG16F">BG16F</option>
            <option value="BG16J">BG16J</option>
            <option value="BG24B">BG24B</option>
            <option value="BG24R">BG24R</option>
            <option value="BGE">BGE</option>
          </select>
        </label>
        <label>
          Data:
          <input type="date" name="data" value={formData.data} onChange={handleChange} />
        </label>
      </div>
      {renderQuotaTable()}
      {renderEquipmentSection('rocadeiras', formData.rocadeiras)}
      {renderEquipmentSection('sopradores', formData.sopradores)}
      {renderEquipmentSection('motopodas', formData.motopodas)}
      {renderEquipmentSection('motosserras', formData.motosserras)}
    </div>
  );
}

export default App;

