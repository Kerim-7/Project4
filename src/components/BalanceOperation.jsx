import React, { useState } from 'react';
import { Form, Button, InputGroup, Alert, Row, Col } from 'react-bootstrap';
import Pinpad from './Pinpad';
import { updatePlaceBalance } from '../services/api';

/**
 * Компонент для выполнения операций с балансом игрока (места)
 * 
 * Валидация суммы до 2 знаков после запятой важна в финансовых приложениях по следующим причинам:
 * 1. Стандарт валют: большинство валют (рубль, доллар, евро) используют 2 знака после запятой
 * 2. Предотвращение ошибок округления: точность до 2 знаков исключает проблемы с плавающей точкой
 * 3. Соответствие банковским стандартам: банки и платежные системы работают с 2 знаками
 * 4. Удобство для пользователей: понятный формат отображения денежных сумм
 * 5. Защита от ошибок: ограничение предотвращает случайный ввод слишком точных значений
 * 6. Аудит и отчетность: упрощает ведение финансовой отчетности
 * 
 * @param {number} deviceId - ID девайса
 * @param {number} placeId - ID места (place)
 * @param {number} currentBalance - Текущий баланс
 * @param {Function} onBalanceUpdate - Callback при успешном обновлении баланса
 */
const BalanceOperation = ({ deviceId, placeId, currentBalance, onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePinpad, setUsePinpad] = useState(false);

  /**
   * Валидация суммы
   * Проверяет, что сумма:
   * - не пустая
   * - является положительным числом
   * - имеет максимум 2 знака после запятой
   */
  const validateAmount = (value) => {
    if (!value || value.trim() === '') {
      return 'Поле суммы не может быть пустым';
    }

    // Проверка на число
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Введите корректное число';
    }

    // Проверка на положительное число
    if (numValue <= 0) {
      return 'Сумма должна быть положительным числом';
    }

    // Проверка на максимум 2 знака после запятой
    // Используем регулярное выражение для проверки формата
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(value)) {
      return 'Сумма может содержать максимум 2 знака после запятой';
    }

    return null;
  };

  /**
   * Обработка изменения суммы с валидацией в реальном времени
   */
  const handleAmountChange = (value) => {
    // Разрешаем пустое значение, цифры, точку и запятую
    if (value === '' || /^\d*[.,]?\d*$/.test(value)) {
      // Заменяем запятую на точку для единообразия
      const normalizedValue = value.replace(',', '.');
      setAmount(normalizedValue);
      setError(''); // Очищаем ошибку при вводе
    }
  };

  /**
   * Выполнение операции пополнения баланса
   */
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

  /**
   * Выполнение операции снятия с баланса
   */
  const handleWithdraw = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    const withdrawAmount = parseFloat(amount);

    // Дополнительная проверка на достаточность средств
    if (withdrawAmount > currentBalance) {
      setError('Недостаточно средств на балансе');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Передаем отрицательное значение для снятия (delta)
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

  /**
   * Обработка ввода с пинпада
   */
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

      <Row className="g-2">
        <Col xs={6}>
          <Button
            variant="success"
            className="w-100"
            onClick={handleDeposit}
            disabled={loading || !amount}
          >
            {loading ? '...' : 'Внести (Deposit)'}
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            variant="warning"
            className="w-100"
            onClick={handleWithdraw}
            disabled={loading || !amount}
          >
            {loading ? '...' : 'Снять (Withdraw)'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BalanceOperation;

