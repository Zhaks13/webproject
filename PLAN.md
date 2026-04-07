# PLAN: Редизайн страницы ProductDetails (Awwwards / Scroll-Driven UX / Premium)

## Цель:
Достичь премиального уровня Awwwards (refl: houseofcorto.com) за счет глубокой интеграции скролл-анимаций, закрепленных (pinned) секций и продвинутого взаимодействия с Framer Motion. 

---

## 1. SCROLL-DRIVEN IMAGE SYSTEM & PINNED SECTION (ВАЖНО)

- **Pinned Container**: Главный блок с товаром имеет высоту `300vh`, что создает 3 "экрана" скролла. Внутри него находится `sticky top-0 h-screen` контейнер.
- **Scroll логика**: 
  Используется хук `useScroll()` (scrollYProgress). 
  Диапазоны:
  - `0 - 0.33` → Изображение 1 (или общий вид)
  - `0.33 - 0.66` → Изображение 2 (детали или ракурс)
  - `0.66 - 1` → Изображение 3 (интерьер/фокус)
- **Анимация смены фото**: 
  - Framer Motion: `AnimatePresence` для плавного crossfade (opacity).
  - Слегка ощутимый `scale (1 -> 1.05)` при появлении нового изображения.

---

## 2. КОМПОНЕНТНАЯ АРХИТЕКТУРА

Страница `ProductDetails.jsx` будет собирать следующие блоки. Логика разбивается, чтобы не делать "один огромный файл". Компоненты будут в папке `src/components/product/`:

1. `StickyGallery.jsx` — левая часть со scroll-driven логикой и массивом картинок.
2. `ProductInfo.jsx` — правая часть, скроллящийся контент с текстами, характеристиками и типографикой 6xl+.
3. `FullImageSection.jsx` — широкая имиджевая фотография между блоками с параллаксом.
4. `RelatedProducts.jsx` — блок "Вам также понравится" со слайдером или сеткой.
5. `CTASection.jsx` — стильный темный футер с призывом к действию.
6. `ProductHero.jsx` — опциональный обволакивающий компонент (если нужен верхний слой).

---

## 3. ПОШАГОВЫЙ ПЛАН РЕАЛИЗАЦИИ

### Step 1: Layout & Component Architecture
- Создать папку `src/components/product/`.
- Создать базовые компоненты-пустышки (`StickyGallery`, `ProductInfo` и т.д.).
- Обновить главный файл `ProductDetails.jsx`: загрузка данных, сборка компонентов.

### Step 2: Сборка Pinned Section (Sticky)
- Главный блок `300vh`. 
- Настройка `flex flex-col lg:flex-row`.
- Левая зона `sticky top-0 h-screen` для галереи. Правая `flex-grow` для контента.

### Step 3: Scroll Logic & Animations (Gallery)
- В `StickyGallery.jsx` подключаем `useScroll` и `useTransform`.
- Динамически вычисляем `currentImageIndex` на основе `scrollYProgress`.
- Добавляем `AnimatePresence` для переходов (fade + slight scale).

### Step 4: Typography & Parallax
- Оформляем тексты в `ProductInfo.jsx` с использованием шрифтов и отступов согласно стилю Awwwards.
- `FullImageSection` настраивается с параллаксом (useTransform).

### Step 5: Related Products & CTA
- Настроить сетку похожих продуктов с ховер-эффектами.
- Реализация огромного темного CTA Footer.

### Step 6: Mobile UX
- Для мобильных устройств убираем `300vh`, `sticky` отключается. Выводим картинки свайпером или стеком, далее весь текст идет подряд.

---
*Приступаем к реализации (Step 1).*
