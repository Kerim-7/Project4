import React, { useState, useEffect } from 'react';
import { Container, Navbar, Alert, Button } from 'react-bootstrap';
import DeviceList from './components/DeviceList';
import PlayerList from './components/PlayerList';
import { getDevices, getPlacesByDevice } from './services/api';
import './App.css';

/**
 * Главный компонент приложения
 * Управляет состоянием девайсов, игроков и отображает интерфейс
 */
function App() {
  const [devices, setDevices] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPlayers, setShowPlayers] = useState(false);

  /**
   * Загрузка списка девайсов при монтировании компонента
   */
  useEffect(() => {
    loadDevices();
  }, []);

  /**
   * Загрузка списка девайсов с сервера
   */
  const loadDevices = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getDevices();
      if (result.success) {
        setDevices(result.data);
      } else {
        setError('Ошибка при загрузке девайсов');
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработка выбора девайса
   * Загружает список игроков для выбранного девайса
   */
  const handleDeviceSelect = async (deviceId) => {
    setSelectedDeviceId(deviceId);
    setPlayersLoading(true);
    setShowPlayers(false);
    setError('');

    try {
      const result = await getPlacesByDevice(deviceId);
      if (result.success) {
        setPlayers(result.data);
        // Анимация появления списка игроков
        setTimeout(() => setShowPlayers(true), 100);
      } else {
        setError(result.error || 'Ошибка при загрузке игроков');
        setPlayers([]);
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером');
      setPlayers([]);
    } finally {
      setPlayersLoading(false);
    }
  };

  /**
   * Обработка обновления баланса игрока (места)
   * Обновляет локальное состояние после успешной операции
   */
  const handleBalanceUpdate = (updateData) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        // Обрабатываем разные форматы ответа от API
        const placeId = updateData.place || updateData.place_id;
        const newBalance = updateData.newBalance || updateData.balances || updateData.balance;
        
        return player.id === placeId
          ? { ...player, balance: newBalance }
          : player;
      })
    );
  };

  /**
   * Сброс выбора девайса
   */
  const handleReset = () => {
    setSelectedDeviceId(null);
    setPlayers([]);
    setShowPlayers(false);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>
            🎮 Управление балансами игроков
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Кнопка возврата к списку девайсов */}
        {selectedDeviceId && (
          <div className="mb-3">
            <Button variant="outline-secondary" onClick={handleReset}>
              ← Назад к списку девайсов
            </Button>
          </div>
        )}

        {/* Список девайсов */}
        {!selectedDeviceId && (
          <div>
            <h2 className="mb-4">Выберите девайс</h2>
            <DeviceList
              devices={devices}
              onDeviceSelect={handleDeviceSelect}
              selectedDeviceId={selectedDeviceId}
              loading={loading}
            />
          </div>
        )}

        {/* Список игроков */}
        {selectedDeviceId && (
          <div>
            {playersLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Загрузка игроков...</span>
                </div>
              </div>
            ) : (
              <PlayerList
                players={players}
                deviceId={selectedDeviceId}
                onBalanceUpdate={handleBalanceUpdate}
                show={showPlayers}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;

