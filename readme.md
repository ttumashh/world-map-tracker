# World Map Tracker

World Map Tracker — это веб-приложение для отслеживания стран на карте мира.

## Технологии

- **Next.js** — основной фреймворк, выбранный из-за опыта работы с JavaScript/React и преимуществ SSR/SSG.
- **React Simple Maps** — библиотека для отображения карт. Выбор сделан в пользу неё, так как:
  - **Leaflet** предоставлял избыточно детализированные карты.
  - **React Simple Maps** идеально подходил для работы с границами стран без лишних деталей.

## Работа с географическими данными

Для отображения координат стран с привязкой к их ISO3-кодам был использован внешний файл с данными:

- Источник: [WunderBart Gist](https://gist.github.com/WunderBart/e18b8c620480a46eb7d11a1dbdbb4aef)
- Причина: стандартные данные, поставляемые вместе с **React Simple Maps**, не содержали необходимой информации о координатах стран и их ISO3 кодах.

## Установка

```bash
git clone https://github.com/ttumashh/world-map-tracker.git
cd world-map-tracker
npm install
npm run dev
```

## Скрипты проекта

- `npm run dev` — запуск локального сервера разработки.
- `npm run build` — сборка проекта для продакшена.
- `npm start` — запуск собранного проекта.

## Лицензия

[MIT License](LICENSE)

---

> Разработка: [Adil Tumash]
