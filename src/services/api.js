/**
 * API сервис для работы с девайсами и местами
 * Swagger: https://dev-space.su/swagger/index.html
 * 
 * Структура данных:
 * Device: { id, name, created_at, updated_at, places: DevicePlace[] }
 * DevicePlace: { device_id, place, balances, currency }
 */

const API_BASE_URL = 'https://dev-space.su/api/v1';
const USE_REAL_API = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockDevices = [
  {
    id: 1,
    name: 'Device Alpha',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    places: [
      { device_id: 1, place: 1, balances: 1250.50, currency: 'RUB' },
      { device_id: 1, place: 2, balances: 850.75, currency: 'RUB' },
      { device_id: 1, place: 3, balances: 2100.00, currency: 'RUB' },
    ],
  },
  {
    id: 2,
    name: 'Device Beta',
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-21T16:00:00Z',
    places: [
      { device_id: 2, place: 1, balances: 500.25, currency: 'RUB' },
      { device_id: 2, place: 2, balances: 1750.00, currency: 'RUB' },
    ],
  },
  {
    id: 3,
    name: 'Device Gamma',
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-22T17:00:00Z',
    places: [
      { device_id: 3, place: 1, balances: 3200.50, currency: 'RUB' },
    ],
  },
  {
    id: 4,
    name: 'Device Delta',
    created_at: '2024-01-18T13:00:00Z',
    updated_at: '2024-01-23T18:00:00Z',
    places: [
      { device_id: 4, place: 1, balances: 950.00, currency: 'RUB' },
      { device_id: 4, place: 2, balances: 150.25, currency: 'RUB' },
      { device_id: 4, place: 3, balances: 2750.75, currency: 'RUB' },
    ],
  },
];

const handleApiError = async (error, response) => {
  if (!response) {
    return {
      success: false,
      error: 'Ошибка сети: не удалось подключиться к серверу',
    };
  }
  
  if (!response.ok) {
    let errorMessage = `Ошибка сервера: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.err) {
        errorMessage = errorData.err;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e2) {
        // Fallback to default message
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
  
  return null;
};

export const getDevices = async () => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/a/devices/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const error = await handleApiError(null, response);
      if (error) return error;
      
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        success: false,
        error: `Ошибка при загрузке девайсов: ${err.message}`,
      };
    }
  }
  
  await delay(500);
  return {
    success: true,
    data: mockDevices,
  };
};

export const getDevice = async (deviceId) => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/a/devices/${deviceId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const error = await handleApiError(null, response);
      if (error) return error;
      
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        success: false,
        error: `Ошибка при загрузке девайса: ${err.message}`,
      };
    }
  }
  
  await delay(300);
  const device = mockDevices.find(d => d.id === deviceId);
  if (!device) {
    return {
      success: false,
      error: 'Девайс не найден',
    };
  }
  
  return {
    success: true,
    data: device,
  };
};

/**
 * Обновление баланса места
 * @param {number} delta - положительное для пополнения, отрицательное для снятия
 */
export const updatePlaceBalance = async (deviceId, placeId, delta) => {
  if (delta === 0) {
    return {
      success: false,
      error: 'Изменение баланса не может быть нулевым',
    };
  }
  
  if (USE_REAL_API) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/a/devices/${deviceId}/place/${placeId}/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ delta }),
        }
      );
      
      const error = await handleApiError(null, response);
      if (error) return error;
      
      const data = await response.json();
      
      if (data.err) {
        return {
          success: false,
          error: data.err || 'Ошибка при обновлении баланса',
        };
      }
      
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        success: false,
        error: `Ошибка при обновлении баланса: ${err.message}`,
      };
    }
  }
  
  await delay(400);
  
  const device = mockDevices.find(d => d.id === deviceId);
  if (!device) {
    return {
      success: false,
      error: 'Девайс не найден',
    };
  }
  
  const place = device.places.find(p => p.place === placeId);
  if (!place) {
    return {
      success: false,
      error: 'Место не найдено',
    };
  }
  
  if (delta < 0 && Math.abs(delta) > place.balances) {
    return {
      success: false,
      error: 'Недостаточно средств на балансе',
    };
  }
  
  const newBalance = place.balances + delta;
  place.balances = newBalance;
  
  return {
    success: true,
    data: {
      device_id: deviceId,
      place: placeId,
      newBalance,
      currency: place.currency,
    },
  };
};

/**
 * Преобразует places в формат для отображения
 * В продакшене имена могут приходить с сервера
 */
export const getPlacesByDevice = async (deviceId) => {
  const result = await getDevice(deviceId);
  
  if (!result.success) {
    return result;
  }
  
  const playerNames = [
    'Александр', 'Мария', 'Дмитрий', 'Анна', 'Иван', 'Елена', 'Сергей', 'Ольга',
    'Андрей', 'Татьяна', 'Михаил', 'Наталья', 'Владимир', 'Екатерина', 'Алексей', 'Юлия',
    'Павел', 'Ирина', 'Николай', 'Светлана', 'Роман', 'Марина', 'Артем', 'Анастасия',
    'Максим', 'Виктория', 'Денис', 'Кристина', 'Антон', 'Алина', 'Игорь', 'Дарья',
    'Олег', 'Полина', 'Юрий', 'Валерия', 'Станислав', 'София', 'Вадим', 'Анжела',
    'Григорий', 'Евгения', 'Борис', 'Людмила', 'Константин', 'Галина', 'Василий', 'Лариса'
  ];
  
  let nameIndex = (deviceId - 1) * 10;
  
  const places = result.data.places.map((place) => {
    const name = playerNames[nameIndex % playerNames.length] || `Игрок ${deviceId}-${place.place}`;
    nameIndex++;
    return {
      id: place.place,
      place: place.place,
      name: name,
      balance: place.balances,
      currency: place.currency,
      device_id: place.device_id,
    };
  });
  
  return {
    success: true,
    data: places,
  };
};
