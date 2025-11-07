# Тестирование API

## Настройка

API сервис поддерживает два режима работы:

1. **Mock режим** (по умолчанию) - использует локальные тестовые данные
2. **Реальный API** - подключается к серверу `https://dev-space.su/api/v1`

## Переключение на реальный API

Откройте файл `src/services/api.js` и измените:

```javascript
const USE_REAL_API = true; // Изменить с false на true
```

## Тестирование через Node.js скрипт

Запустите тестовый скрипт:

```bash
npm run test-api
```

Скрипт проверит:
- ✅ GET `/a/devices/` - получение списка девайсов
- ✅ GET `/a/devices/{device_id}/` - получение конкретного девайса
- ✅ POST `/a/devices/{device_id}/place/{place_id}/update` - обновление баланса

## Тестирование через приложение

1. Установите `USE_REAL_API = true` в `src/services/api.js`
2. Запустите приложение: `npm run dev`
3. Откройте браузер и проверьте работу с реальным API

## Структура API

### Base URL
```
https://dev-space.su/api/v1
```

### Эндпоинты

#### GET /a/devices/
Получить список всех девайсов

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Device Name",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T15:30:00Z",
    "places": [
      {
        "device_id": 1,
        "place": 1,
        "balances": 1250.50,
        "currency": "RUB"
      }
    ]
  }
]
```

#### GET /a/devices/{device_id}/
Получить конкретный девайс

**Параметры:**
- `device_id` (path) - ID девайса

**Ответ:**
```json
{
  "id": 1,
  "name": "Device Name",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-20T15:30:00Z",
  "places": [...]
}
```

#### POST /a/devices/{device_id}/place/{place_id}/update
Обновить баланс места

**Параметры:**
- `device_id` (path) - ID девайса
- `place_id` (path) - ID места
- `delta` (body) - Изменение баланса (положительное для пополнения, отрицательное для снятия)

**Тело запроса:**
```json
{
  "delta": 100.50
}
```

**Ответ (успех):**
```json
{
  "device_id": 1,
  "place": 1,
  "balances": 1350.00,
  "currency": "RUB"
}
```

**Ответ (ошибка):**
```json
{
  "err": "Недостаточно средств на балансе"
}
```

## Обработка ошибок

API сервис обрабатывает следующие типы ошибок:

- **Ошибки сети** - проблемы с подключением к серверу
- **HTTP ошибки** - статус коды 4xx, 5xx
- **Ошибки API** - поле `err` в ответе сервера
- **Валидация** - проверка параметров перед отправкой

## Примеры использования

### В коде приложения

```javascript
import { getDevices, getDevice, updatePlaceBalance } from './services/api';

// Получить список девайсов
const result = await getDevices();
if (result.success) {
  console.log(result.data);
}

// Получить конкретный девайс
const deviceResult = await getDevice(1);
if (deviceResult.success) {
  console.log(deviceResult.data);
}

// Пополнить баланс
const updateResult = await updatePlaceBalance(1, 1, 100.50);
if (updateResult.success) {
  console.log('Новый баланс:', updateResult.data.balances);
} else {
  console.error('Ошибка:', updateResult.error);
}

// Снять с баланса
const withdrawResult = await updatePlaceBalance(1, 1, -50.25);
```

## Отладка

Для отладки API запросов откройте консоль браузера (F12) и проверьте:

1. Сетевые запросы во вкладке Network
2. Ошибки в консоли
3. Ответы сервера

## Примечания

- Убедитесь, что сервер доступен и CORS настроен правильно
- Проверьте, что формат данных соответствует ожидаемому API
- При работе с реальным API могут потребоваться заголовки аутентификации

