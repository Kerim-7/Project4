import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import DeviceList from './components/DeviceList';
import PlayerList from './components/PlayerList';
import { getDevices, getPlacesByDevice } from './services/api';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

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

  const handleDeviceSelect = async (deviceId) => {
    setSelectedDeviceId(deviceId);
    setPlayersLoading(true);
    setShowPlayers(false);
    setError('');

    try {
      const result = await getPlacesByDevice(deviceId);
      if (result.success) {
        setPlayers(result.data);
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
   * API возвращает: {device_id, place, balances, currency}
   * Обрабатываем разные форматы ответа для совместимости
   */
  const handleBalanceUpdate = (updateData) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const placeId = updateData.place || updateData.place_id;
        const newBalance = updateData.balances || updateData.newBalance || updateData.balance;
        
        return player.id === placeId
          ? { ...player, balance: newBalance }
          : player;
      })
    );
  };

  const handleReset = () => {
    setSelectedDeviceId(null);
    setPlayers([]);
    setShowPlayers(false);
  };

  return (
    <div className="App">
      <Container>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {selectedDeviceId && (
          <div className="mb-3">
            <Button variant="outline-secondary" onClick={handleReset}>
              ← Назад к списку девайсов
            </Button>
          </div>
        )}

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
