import { useState, useEffect } from 'react';

function App() {
  const [activeProcess, setActiveProcess] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [memoValue, setMemoValue] = useState('');

  // Función para llamar al POST que inicia el proceso
  const startProcess = async () => {
    setActiveProcess(true);
    try {
      const response = await fetch('https://examenback.onrender.com/api/process-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputValue })
      });
      const data = await response.json();
      if (data.success) {
        setActiveProcess(false);
      }
    } catch (error) {
      setActiveProcess(false);

    } finally {
      setActiveProcess(false);
    }
  };

  // Llamar a la segunda API cada 1 segundo
  useEffect(() => {
    if (!activeProcess) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://examenback.onrender.com/api/progress-file');
        const data = await response.json();
        
        setMemoValue((prevMemo) => prevMemo + '\n' + data.download + ", " + data.unzip + ", " + data.save);
      } catch (error) {
        console.error('Error al obtener datos', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeProcess]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleStartProcess = (event) => {
    event.preventDefault();
    startProcess();
    //alert(`Valor ingresado: ${inputValue}`);
  };

  return (
    <div className="tab-container">
      <div className="button-container">
        <button
          onClick={() => setActiveTab(1)}
          className={`btn ${activeTab === 1 ? 'btn-primary' : 'btn-light'}`}
        >
          Iniciar el proceso
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`btn ${activeTab === 2 ? 'btn-primary' : 'btn-light'}`}
        >
          Ver Progreso
        </button>
      </div>

      <div className="content">
        {activeTab === 1 ? (
          <div className="content-box">
            <div className="input-container">
              <input className='form-control'
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Escribe algo..."
              />
              <button className='btn btn-primary' onClick={handleStartProcess}>Enviar</button>
            </div>
          </div>
        ) : (
          <div className="content-box">
            <textarea
              className='textarea-full'
              value={memoValue}
              onChange={(e) => setMemoValue(e.target.value)}  // Manejar cambios en el textarea
              rows="10"  // Número de filas visibles
              cols="50"  // Número de columnas visibles
              placeholder="Cadenas de texto agregadas aparecerán aquí..."

            />
          </div>
        )
        }
      </div>
    </div>
  )
}

export default App
