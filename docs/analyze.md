# Project Analysis

## Architecture Overview
Проект представляет собой микросервисную архитектуру, состоящую из Frontend-приложения (React + Vite) и Backend-сервисов (Node.js + Express), объединённых через API Gateway. Разворачивается с помощью Docker Compose. База данных — PostgreSQL, с разделением по схемам для разных сервисов (`products` и `orders`). Взаимодействие с БД осуществляется через ORM Prisma.

## Frontend Analysis
**Технологии:** React, React Router, Vite, TailwindCSS (вероятно), Framer Motion, Axios.
**Структура страниц (`src/pages`):**
- `Home.jsx` — главная страница
- `Products.jsx` — каталог товаров
- `ProductDetails.jsx` — детальная страница товара
- `CustomOrder.jsx` — форма индивидуального заказа
- `Contacts.jsx` — контакты
- `AuthPage.jsx` — страница авторизации (вход / регистрация)
- `Admin.jsx` — панель администратора

**Маршрутизация (`App.jsx`):**
Используется `BrowserRouter`. При успешном входе (`handleLogin`) происходит редирект на `/admin` для пользователей с `role === 'ADMIN'` и на `/profile` для остальных. *Примечание: маршрут `/profile` в данный момент не определен.*

**Auth & API Layer:**
- Авторизация работает на базе отправки POST-запроса на `/auth/login` или `/auth/register` (через сервис `orders-service`).
- Аутентификация сохраняется путём записи объекта `user` напрямую в `localStorage` (без JWT-токенов).
- Запросы отправляются через инстанс `axios` (`src/api.js`), который настроен на прокси-порт API Gateway (`import.meta.env.VITE_API_URL` -> `http://localhost:8080/api`).

## Backend Analysis
Микросервисы (RESTful API):

1. **API Gateway (`api-gateway`) - Порт 8080:**
   - Роутит запросы на соответствующие микросервисы.
   - `/api/products` проксируется на `products-service:3001`
   - `/api/orders` проксируется на `orders-service:3002`
   - `/api/auth` проксируется на `orders-service:3002` (обрабатывается `auth.js`)
   - Обрабатывает CORS конфигурацию (разрешены порты 3000 и 5173).

2. **Products Service (`products-service`) - Порт 3001:**
   - Отвечает за каталог товаров.
   - Подключен к PostgreSQL (схема `products`).

3. **Orders Service (`orders-service`) - Порт 3002:**
   - Отвечает за заказы и аутентификацию пользователей.
   - Маршруты: `POST /login`, `POST /register` в `auth.js` (через `bcrypt` для хеширования пароля).
   - Подключен к PostgreSQL (схема `orders`).

## Database Schema
Используется PostgreSQL через Prisma, базы разделены между микросервисами:

**Products Service (`schema.prisma`):**
- `Product`: id, name, description, price, image, createdAt, updatedAt.

**Orders Service (`schema.prisma`):**
- `User`: id, name, phone (уникальный ключ для логина), password (bcrypt), role, createdAt. Имеет связь 1-ко-многим с `Order`.
- `Order`: id, customerName, phone, status ("NEW", "IN_PROGRESS", "READY"), productId, createdAt, updatedAt, опциональный `userId` (связь с `User`).

## API Flow
1. Пользователь взаимодействует с React-интерфейсом.
2. `axios` отправляет запрос на порт 8080 (API Gateway).
3. API Gateway определяет сервис по URL:
   - `/api/auth/*` и `/api/orders/*` -> `orders-service:3002`
   - `/api/products/*` -> `products-service:3001`
4. Микросервис взаимодействует со своей схемой в PostgreSQL (`workshop_db`) через Prisma.
5. Ответ возвращается обратно через Gateway на Frontend.

## Problems / Gaps
- **Безопасность аутентификации:** Пароли хешируются, но после логина бэкенд возвращает только объект пользователя, который сохраняется в `localStorage`. JWT или куки для поддержки сессии сейчас отсутствуют (в коде есть пометка `// 👉 позже сюда добавим JWT`).
- **Защита маршрутов на клиенте:** Роуты вроде `/admin` доступны всем, нет `ProtectedRoute` оберток для ограничения доступа.
- **Отсутствующий функционал:** Упоминаемый в роутинге редирект после логина пользователя на `/profile` пока ведёт в никуда (компонент `ProfilePage` не существует).
- **Синхронизация схем БД:** Связь "Заказ" -> "Товар" (`productId`) не является строгим внешним ключом, так как они находятся в разных базах/схемах. Из-за этого может нарушаться консистентность данных при удалении товаров.

---

## How to work with this project (for AI agents)

### 1. Архитектура и Файловая Структура
- Frontend: Все визуальные компоненты, страницы и API-обертки находятся в `c:\webproject\frontend\src`. При создании страниц не забудь обновить `App.jsx`.
- Backend (Products): `c:\webproject\products-service` (Схема: `products-service/prisma/schema.prisma`).
- Backend (Orders/Auth): `c:\webproject\orders-service` (Схема: `orders-service/prisma/schema.prisma`).
- API Gateway: `c:\webproject\api-gateway` (маршрутизатор, изменять только если добавляются новые микросервисы или глобальные пути).

### 2. Куда добавлять код
- **Новые страницы фронтенда:** Создавать в `frontend/src/pages/`, добавлять маршрут в `frontend/src/App.jsx`.
- **Новые эндпоинты API:**
  1. Реализовать логику в роутах нужного сервиса (например, `orders-service/src/routes`).
  2. Убедиться, что `api-gateway` пропускает нужный префикс.
  3. Добавить API-вызов в `frontend/src/api.js` (либо вызывать `api.post(...)` напрямую из компонента, используя префикс, перехваченный gateway).
- **Обновление БД:**
  1. Изменить `schema.prisma` внутри целевого сервиса.
  2. Обязательно предупредить пользователя о необходимости выполнить `npx prisma db push` или `migrate`.

### 3. Как не сломать архитектуру
- Не нарушай изоляцию сервисов. Не делай SQL-связей (foreign keys) между таблицей из `products` и таблицей из `orders`.
- Сохраняй стиль: на фронтенде Tailwind CSS + Framer Motion. Используй `#051F20`, `#0D3B2E` и `#DAF1DE` как основные цвета (Dark Theme UI).
- Взаимодействие фронта и бэка должно 100% идти через `frontend/src/api.js` (`api.post`, `api.get`), а не через fetch или прямые обращения на порты `3001` / `3002`.
