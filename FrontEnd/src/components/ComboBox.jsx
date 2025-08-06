import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../style/ComboBox.css"; 

const ComboBox = ({ 
  fetchUrl, 
  placeholder, 
  onSelect, 
  initialValue, 
  disabled,
  dependencies 
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fetchUrl || disabled) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(fetchUrl);

        if (Array.isArray(response.data)) {
          setOptions(response.data);
        } else {
          console.error("Resposta da API não é um array:", response.data);
          setOptions([]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl, disabled, dependencies]);

  const handleSelect = (option) => {
    setInputValue(option.name);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="combo-box position-relative">
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
        <span className="input-group-text">
          <i className="bi bi-caret-down-fill"></i> {/* Requer Bootstrap Icons */}
        </span>
      </div>

      {isOpen && !disabled && (
        <ul className="list-group position-absolute w-100 mt-1 shadow-sm combo-options">
          {loading ? (
            <li className="list-group-item">Carregando...</li>
          ) : options.length === 0 ? (
            <li className="list-group-item">Nenhuma opção encontrada</li>
          ) : (
            options.map((option) => (
              <li
                key={option.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;
