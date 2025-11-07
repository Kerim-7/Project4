import React from 'react';
import { Button, Card } from 'react-bootstrap';

/**
 * Компонент цифрового пинпада для ввода суммы
 * Бонусная функция для удобного ввода сумм
 * 
 * @param {string} value - Текущее значение суммы
 * @param {Function} onChange - Callback при изменении значения
 * @param {Function} onDeposit - Callback для операции пополнения
 * @param {Function} onWithdraw - Callback для операции снятия
 * @param {boolean} loading - Флаг загрузки
 * @param {boolean} disabled - Флаг отключения
 */
const Pinpad = ({ value, onChange, onDeposit, onWithdraw, loading, disabled }) => {
  /**
   * Обработка нажатия цифры
   */
  const handleNumberClick = (num) => {
    if (disabled || loading) return;
    
    const newValue = value === '' ? num.toString() : value + num;
    onChange(newValue);
  };

  /**
   * Обработка нажатия точки/запятой
   */
  const handleDecimalClick = () => {
    if (disabled || loading) return;
    
    // Проверяем, что точка еще не добавлена
    if (!value.includes('.')) {
      const newValue = value === '' ? '0.' : value + '.';
      onChange(newValue);
    }
  };

  /**
   * Обработка удаления последнего символа
   */
  const handleBackspace = () => {
    if (disabled || loading) return;
    
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  /**
   * Обработка очистки
   */
  const handleClear = () => {
    if (disabled || loading) return;
    onChange('');
  };

  return (
    <Card className="border">
      <Card.Body className="p-2">
        {/* Дисплей с текущим значением */}
        <div className="bg-light border rounded p-3 mb-2 text-end">
          <span className="fs-4 fw-bold">
            {value || '0.00'}
          </span>
        </div>

        {/* Цифровая клавиатура */}
        <div className="row g-2 mb-2">
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('7')}
              disabled={disabled || loading}
            >
              7
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('8')}
              disabled={disabled || loading}
            >
              8
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('9')}
              disabled={disabled || loading}
            >
              9
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('4')}
              disabled={disabled || loading}
            >
              4
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('5')}
              disabled={disabled || loading}
            >
              5
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('6')}
              disabled={disabled || loading}
            >
              6
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('1')}
              disabled={disabled || loading}
            >
              1
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('2')}
              disabled={disabled || loading}
            >
              2
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('3')}
              disabled={disabled || loading}
            >
              3
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleNumberClick('0')}
              disabled={disabled || loading}
            >
              0
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleDecimalClick}
              disabled={disabled || loading}
            >
              .
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={handleBackspace}
              disabled={disabled || loading}
            >
              ⌫
            </Button>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="row g-2 mb-2">
          <div className="col-6">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleClear}
              disabled={disabled || loading}
            >
              Очистить
            </Button>
          </div>
        </div>

        {/* Кнопки операций */}
        <div className="row g-2">
          <div className="col-6">
            <Button
              variant="success"
              className="w-100"
              onClick={onDeposit}
              disabled={disabled || loading || !value}
            >
              Внести
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant="warning"
              className="w-100"
              onClick={onWithdraw}
              disabled={disabled || loading || !value}
            >
              Снять
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Pinpad;

