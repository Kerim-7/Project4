import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import BalanceOperation from './BalanceOperation';

const PlayerList = ({ players, deviceId, onBalanceUpdate, show = true }) => {
  if (!players || players.length === 0) {
    return (
      <Card className="mt-4">
        <Card.Body>
          <p className="text-muted mb-0">Игроки не найдены</p>
        </Card.Body>
      </Card>
    );
  }

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <div style={{ opacity: show ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Список игроков</h5>
        </Card.Header>
        <ListGroup variant="flush">
          {players.map((player, index) => (
            <ListGroup.Item
              key={player.id}
              className="px-3 py-3"
              style={{
                animation: show ? `fadeInUp 0.4s ease ${index * 0.1}s both` : 'none',
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                <div className="w-100 mb-2 mb-md-0">
                  <h6 className="mb-2">{player.name}</h6>
                  <Badge bg="primary" className="fs-6 d-inline-block">
                    Баланс: {formatBalance(player.balance)} {player.currency || '₽'}
                  </Badge>
                </div>
              </div>
              <BalanceOperation
                deviceId={deviceId}
                placeId={player.id}
                currentBalance={player.balance}
                onBalanceUpdate={onBalanceUpdate}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default PlayerList;
