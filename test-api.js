/**
 * Тестовый скрипт для проверки API
 * Запуск: node test-api.js
 */

const API_BASE_URL = 'https://dev-space.su/api/v1';

/**
 * Тест получения списка девайсов
 */
async function testGetDevices() {
  console.log('\n=== Тест: GET /a/devices/ ===');
  try {
    const response = await fetch(`${API_BASE_URL}/a/devices/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return;
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('✅ Успешно получен список девайсов');
    return data;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

/**
 * Тест получения конкретного девайса
 */
async function testGetDevice(deviceId) {
  console.log(`\n=== Тест: GET /a/devices/${deviceId}/ ===`);
  try {
    const response = await fetch(`${API_BASE_URL}/a/devices/${deviceId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return;
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('✅ Успешно получен девайс');
    return data;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

/**
 * Тест обновления баланса
 */
async function testUpdateBalance(deviceId, placeId, delta) {
  console.log(`\n=== Тест: POST /a/devices/${deviceId}/place/${placeId}/update ===`);
  console.log('Delta:', delta);
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
    
    console.log('Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return;
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('✅ Успешно обновлен баланс');
    return data;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

/**
 * Основная функция тестирования
 */
async function runTests() {
  console.log('🚀 Начало тестирования API');
  console.log('Base URL:', API_BASE_URL);
  
  // Тест 1: Получить список девайсов
  const devices = await testGetDevices();
  
  if (devices && devices.length > 0) {
    const firstDevice = devices[0];
    const deviceId = firstDevice.id;
    
    // Тест 2: Получить конкретный девайс
    const device = await testGetDevice(deviceId);
    
    if (device && device.places && device.places.length > 0) {
      const firstPlace = device.places[0];
      const placeId = firstPlace.place;
      
      // Тест 3: Пополнение баланса
      await testUpdateBalance(deviceId, placeId, 100.50);
      
      // Тест 4: Снятие с баланса
      await testUpdateBalance(deviceId, placeId, -50.25);
    }
  }
  
  console.log('\n✅ Тестирование завершено');
}

// Запуск тестов
runTests().catch(console.error);

