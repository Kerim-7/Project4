import React from 'react';
import { Button, Card } from 'react-bootstrap';

const Pinpad = ({ value, onChange, onDeposit, onWithdraw, loading, disabled }) => {
  const handleNumberClick = (num) => {
    if (disabled || loading) return;
    const newValue = value === '' ? num.toString() : value + num;
    onChange(newValue);
  };

  const handleDecimalClick = () => {
    if (disabled || loading) return;
    if (!value.includes('.')) {
      const newValue = value === '' ? '0.' : value + '.';
      onChange(newValue);
    }
  };

  const handleBackspace = () => {
    if (disabled || loading) return;
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (disabled || loading) return;
    onChange('');
  };

  return (
    <Card className="border">
      <Card.Body className="p-2">
        <div className="bg-light border rounded p-3 mb-2 text-end pinpad-display">
          <span className="fs-4 fw-bold d-block">
            {value || '0.00'}
          </span>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('7')}
              disabled={disabled || loading}
            >
              7
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('8')}
              disabled={disabled || loading}
            >
              8
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('9')}
              disabled={disabled || loading}
            >
              9
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('4')}
              disabled={disabled || loading}
            >
              4
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('5')}
              disabled={disabled || loading}
            >
              5
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('6')}
              disabled={disabled || loading}
            >
              6
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('1')}
              disabled={disabled || loading}
            >
              1
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('2')}
              disabled={disabled || loading}
            >
              2
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('3')}
              disabled={disabled || loading}
            >
              3
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={() => handleNumberClick('0')}
              disabled={disabled || loading}
            >
              0
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-secondary"
              className="w-100 pinpad-button"
              onClick={handleDecimalClick}
              disabled={disabled || loading}
            >
              .
            </Button>
          </div>
          <div className="col-4">
            <Button
              variant="outline-danger"
              className="w-100 pinpad-button"
              onClick={handleBackspace}
              disabled={disabled || loading}
            >
              ⌫
            </Button>
          </div>
        </div>

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
