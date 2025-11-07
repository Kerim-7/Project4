/**
 * API сервис для работы с девайсами и местами (places)
 * Соответствует Swagger документации: https://dev-space.su/swagger/index.html
 * 
 * Структура данных:
 * - Device: { id, name, created_at, updated_at, places: DevicePlace[] }
 * - DevicePlace: { device_id, place, balances, currency }
 */

// Базовый URL API (для реального использования)
const API_BASE_URL = 'https://dev-space.su/api/v1';

// Флаг для переключения между mock и реальным API
// Установите USE_REAL_API = true для работы с реальным API
const USE_REAL_API = true;

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock данные девайсов с places
// В реальном приложении это будет приходить с сервера
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

/**
 * Обработка ошибок API
 */
const handleApiError = (error, response) => {
  if (!response) {
    return {
      success: false,
      error: 'Ошибка сети: не удалось подключиться к серверу',
    };
  }
  
  if (!response.ok) {
    return {
      success: false,
      error: `Ошибка сервера: ${response.status} ${response.statusText}`,
    };
  }
  
  return null;
};

/**
 * GET /a/devices/
 * Получить список всех девайсов
 * @returns {Promise<{success: boolean, data?: Device[], error?: string}>}
 */
export const getDevices = async () => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/a/devices/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const error = handleApiError(null, response);
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
  
  // Mock режим
  await delay(500);
  return {
    success: true,
    data: mockDevices,
  };
};

/**
 * GET /a/devices/{device_id}/
 * Получить конкретный девайс с его местами
 * @param {number} deviceId - ID девайса
 * @returns {Promise<{success: boolean, data?: Device, error?: string}>}
 */
export const getDevice = async (deviceId) => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/a/devices/${deviceId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const error = handleApiError(null, response);
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
  
  // Mock режим
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
 * POST /a/devices/{device_id}/place/{place_id}/update
 * Обновить баланс для конкретного места на девайсе
 * @param {number} deviceId - ID девайса
 * @param {number} placeId - ID места (place)
 * @param {number} delta - Изменение баланса (положительное для пополнения, отрицательное для снятия)
 * @returns {Promise<{success: boolean, data?: {device_id, place, newBalance}, error?: string}>}
 */
export const updatePlaceBalance = async (deviceId, placeId, delta) => {
  // Валидация delta
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
      
      const error = handleApiError(null, response);
      if (error) return error;
      
      const data = await response.json();
      
      // Проверка на ошибки в ответе API
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
  
  // Mock режим
  await delay(400);
  
  // Найти девайс
  const device = mockDevices.find(d => d.id === deviceId);
  if (!device) {
    return {
      success: false,
      error: 'Девайс не найден',
    };
  }
  
  // Найти место
  const place = device.places.find(p => p.place === placeId);
  if (!place) {
    return {
      success: false,
      error: 'Место не найдено',
    };
  }
  
  // Проверка на недостаточность средств при снятии
  if (delta < 0 && Math.abs(delta) > place.balances) {
    return {
      success: false,
      error: 'Недостаточно средств на балансе',
    };
  }
  
  // Обновление баланса
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
 * Вспомогательная функция для получения мест девайса
 * Преобразует places в формат для отображения (с именами игроков)
 * @param {number} deviceId - ID девайса
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getPlacesByDevice = async (deviceId) => {
  const result = await getDevice(deviceId);
  
  if (!result.success) {
    return result;
  }
  
  // Преобразуем places в формат для отображения
  // В реальном приложении имена могут приходить с сервера
  const places = result.data.places.map((place, index) => ({
    id: place.place, // Используем place как id
    place: place.place,
    name: `Игрок ${place.place}`, // Или можно использовать другое имя
    balance: place.balances,
    currency: place.currency,
    device_id: place.device_id,
  }));
  
  return {
    success: true,
    data: places,
  };
};
