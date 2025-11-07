import React from 'react';
import { Card, Badge, Spinner, Alert } from 'react-bootstrap';

/**
 * Компонент для отображения списка девайсов
 * @param {Array} devices - Массив девайсов
 * @param {Function} onDeviceSelect - Callback при выборе девайса
 * @param {number} selectedDeviceId - ID выбранного девайса
 * @param {boolean} loading - Флаг загрузки
 */
const DeviceList = ({ devices, onDeviceSelect, selectedDeviceId, loading }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        Девайсы не найдены
      </Alert>
    );
  }

  return (
    <div className="row g-3">
      {devices.map((device) => (
        <div key={device.id} className="col-12 col-md-6 col-lg-4">
          <Card
            className={`h-100 cursor-pointer ${
              selectedDeviceId === device.id ? 'border-primary shadow' : ''
            }`}
            onClick={() => onDeviceSelect(device.id)}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
          >
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-start">
                <span>{device.name}</span>
                {device.places && (
                  <Badge bg="info">
                    {device.places.length} {device.places.length === 1 ? 'место' : 'мест'}
                  </Badge>
                )}
              </Card.Title>
              <Card.Text className="text-muted mb-0">
                <small>ID: {device.id}</small>
                {device.places && device.places.length > 0 && (
                  <>
                    <br />
                    <small>Мест: {device.places.length}</small>
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;

