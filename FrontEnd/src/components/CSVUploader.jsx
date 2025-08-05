import React, { useState } from 'react';
import Papa from 'papaparse';
import '../style/CSVUploader.css';

function CSVUploader() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null); // Novo estado para o arquivo

  // Lida com a seleção do arquivo e pré-visualiza os dados
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError('');
    setCsvData([]);
    setHeaders([]);
    setFileToUpload(file); // Armazena o arquivo para enviar ao backend

    // Verificar se é um arquivo CSV válido
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido');
      setIsLoading(false);
      setFileToUpload(null);
      return;
    }

    // Processar o arquivo CSV para pré-visualização (uso do PapaParse)
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Erro ao processar o arquivo: ' + results.errors[0].message);
        } else {
          // Os cabeçalhos do CSV devem ser "Name" e "Description" para corresponder ao backend
          const expectedHeaders = ['Name', 'Description'];
          const fileHeaders = results.meta.fields;
          
          if (fileHeaders.length === expectedHeaders.length && 
              expectedHeaders.every(h => fileHeaders.includes(h))) {
            setHeaders(fileHeaders);
            setCsvData(results.data);
          } else {
            setError(`O cabeçalho do CSV deve ter as colunas: ${expectedHeaders.join(', ')}`);
            setCsvData([]);
          }
        }
        setIsLoading(false);
      },
      error: (error) => {
        setError('Erro ao ler o arquivo: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  // Envia o arquivo CSV para o backend
  const handleProcessFile = async () => {
    if (!fileToUpload) {
      setError('Nenhum arquivo selecionado para processar.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    // A chave 'file' deve corresponder ao parâmetro do seu backend: [FromForm] IFormFile file
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('http://localhost:5028/api/Project/import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Projetos importados com sucesso!");
        // Opcional: limpar o estado após o sucesso
        setCsvData([]);
        setFileToUpload(null);
        setFileName('');
        setHeaders([]);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.errors?.join(", ") || "Erro desconhecido";
        setError(`Erro na importação: ${errorMessage}`);
      }
    } catch (error) {
      setError('Ocorreu um erro ao conectar com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para baixar o template
  const downloadTemplate = () => {
    const template = "Name,Description\nProjeto A,Viagem de negócios para São Paulo\nProjeto B,Compra de equipamentos para escritório";
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_projetos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Carregar Arquivo de Projetos (CSV)</h2>
        </div>
        
        <div className="card-body">
          {/* Área de Upload */}
          <div className="mb-4">
            <label htmlFor="csvFile" className="form-label">
              Selecione um arquivo CSV:
            </label>
            <div className="input-group">
              <input 
                type="file" 
                className="form-control" 
                id="csvFile" 
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={downloadTemplate}
              >
                Baixar Template
              </button>
            </div>
            <div className="form-text">
              Formatos suportados: CSV. Cabeçalhos obrigatórios: "Name", "Description".
              <a href="#" onClick={downloadTemplate} className="ms-1">
                Baixar modelo de exemplo
              </a>
            </div>
          </div>

          {/* Feedback */}
          {isLoading && (
            <div className="alert alert-info">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Processando...
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Resultados */}
          {csvData.length > 0 && !isLoading && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  Dados do Arquivo: {fileName}
                </h4>
                <span className="badge bg-success">
                  {csvData.length} registros encontrados
                </span>
              </div>

              <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <table className="table table-striped table-hover">
                  <thead className="table-dark sticky-top">
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 100).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <td key={colIndex}>
                            {row[header] !== null && row[header] !== undefined 
                              ? row[header].toString() 
                              : ''
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {csvData.length > 100 && (
                <div className="alert alert-warning">
                  Exibindo os primeiros 100 registros de {csvData.length}.
                </div>
              )}

              <div className="mt-4 d-flex justify-content-end gap-2">
                <button className="btn btn-primary" onClick={handleProcessFile}>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Enviar para o Backend
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CSVUploader;