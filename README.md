## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите dev-сервер:
```bash
npm run dev
```

3. Откройте браузер по адресу, указанному в консоли (обычно http://localhost:5173)

## Сборка для продакшена

```bash
npm run build
```

## Структура проекта

```
src/
  ├── components/
  │   ├── DeviceList.jsx      # Список девайсов
  │   ├── PlayerList.jsx      # Список игроков
  │   ├── BalanceOperation.jsx # Операции с балансом
  │   └── Pinpad.jsx          # Цифровой пинпад (бонус)
  ├── services/
  │   └── api.js              # Mock API сервис
  ├── App.jsx                 # Главный компонент
  ├── App.css                 # Стили приложения
  └── main.jsx                # Точка входа
```

## Технологии

- React 18
- React-Bootstrap 2.9
- Bootstrap 5.3
- Vite 5
- React Transition Group (для анимаций)

## Тестирование API

### Переключение на реальный API

По умолчанию приложение использует mock данные. Для работы с реальным API:

1. Откройте `src/services/api.js`
2. Измените `USE_REAL_API = true`
3. Перезапустите приложение

### Тестирование через скрипт

Запустите тестовый скрипт для проверки API:

```bash
npm run test-api
```

Скрипт проверит все эндпоинты API и выведет результаты в консоль.

Подробная документация по тестированию: [API_TESTING.md](./API_TESTING.md)



