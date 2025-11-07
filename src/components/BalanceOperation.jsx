import React, { useState } from 'react';
import { Form, Button, InputGroup, Alert, Row, Col } from 'react-bootstrap';
import Pinpad from './Pinpad';
import { updatePlaceBalance } from '../services/api';

/**
 * Валидация до 2 знаков после запятой критична для финансовых операций:
 * - Соответствие стандартам валют (RUB, USD, EUR)
 * - Предотвращение ошибок округления с плавающей точкой
 * - Соответствие банковским стандартам
 * - Упрощение аудита и отчетности
 */
const BalanceOperation = ({ deviceId, placeId, currentBalance, onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePinpad, setUsePinpad] = useState(false);

  const validateAmount = (value) => {
    if (!value || value.trim() === '') {
      return 'Поле суммы не может быть пустым';
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Введите корректное число';
    }

    if (numValue <= 0) {
      return 'Сумма должна быть положительным числом';
    }

    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(value)) {
      return 'Сумма может содержать максимум 2 знака после запятой';
    }

    return null;
  };

  const handleAmountChange = (value) => {
    if (value === '' || /^\d*[.,]?\d*$/.test(value)) {
      const normalizedValue = value.replace(',', '.');
      setAmount(normalizedValue);
      setError('');
    }
  };

  const handleDeposit = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const delta = parseFloat(amount);
      const result = await updatePlaceBalance(deviceId, placeId, delta);

      if (result.success) {
        setAmount('');
        onBalanceUpdate(result.data);
      } else {
        setError(result.error || 'Ошибка при выполнении операции');
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount > currentBalance) {
      setError('Недостаточно средств на балансе');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const delta = -withdrawAmount;
      const result = await updatePlaceBalance(deviceId, placeId, delta);

      if (result.success) {
        setAmount('');
        onBalanceUpdate(result.data);
      } else {
        setError(result.error || 'Ошибка при выполнении операции');
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handlePinpadInput = (value) => {
    handleAmountChange(value);
  };

  return (
    <div>
      <div className="mb-3">
        <Form.Label>Сумма операции</Form.Label>
        {usePinpad ? (
          <Pinpad
            value={amount}
            onChange={handlePinpadInput}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            loading={loading}
            disabled={loading}
          />
        ) : (
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              disabled={loading}
              isInvalid={!!error}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setUsePinpad(true)}
              disabled={loading}
            >
              🔢
            </Button>
          </InputGroup>
        )}
        {usePinpad && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 p-0"
            onClick={() => setUsePinpad(false)}
            disabled={loading}
          >
            Использовать клавиатуру
          </Button>
        )}
        <Form.Text className="text-muted">
          Введите сумму (максимум 2 знака после запятой)
        </Form.Text>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row className="g-2 balance-operation-buttons">
        <Col xs={12} sm={6}>
          <Button
            variant="success"
            className="w-100"
            onClick={handleDeposit}
            disabled={loading || !amount}
            size="lg"
          >
            {loading ? '...' : 'Внести (Deposit)'}
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Button
            variant="warning"
            className="w-100"
            onClick={handleWithdraw}
            disabled={loading || !amount}
            size="lg"
          >
            {loading ? '...' : 'Снять (Withdraw)'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BalanceOperation;
