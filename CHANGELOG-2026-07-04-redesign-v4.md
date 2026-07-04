# ath.camera — редизайн v4 (2026-07-04)

Полная замена лендинга v2 (длинный скролл) на одноэкранный сайт. Задеплоен в корень `index.html`.

## Концепция

Одна страница без вертикального скролла (mobile-first, `100dvh`, `overflow: hidden`):

```
ATH                       ← wordmark (Source Serif 4)
extra content and growth layer for projects on Solana▌   ← слоган, курсор мигает постоянно
[▸ Who we are] [▸ What we do] [▸ Get in touch]           ← панели-диалоги
—————————— галерея (26 видео, свайп/drag/колёсико) ——————————
follow co-founders
[VALI | ATH] [TOM | ATH]
© 2026 ATH · @athcamera
```

Стиль: тёмная база v2 (ink #0A0A0A + ice-blue #BFE8F2) + лёгкий Y2K-акцент —
бевел-кнопки (вдавливаются при клике), моно-лейблы JetBrains Mono, курсор-блок,
scanlines на карточке при наведении. Tailwind CDN удалён — чистый inline CSS.

## Intro-анимация (~7 сек)

1. ATH + слоган появляются в **центре экрана**; слоган печатается по буквам (30мс/символ)
2. Пауза 1.1s на чтение
3. Блок «всплывает» на своё место — transform 1.5s cubic-bezier(0.4, 0, 0.1, 1)
4. Через 0.8s въезжает галерея (1.5s), через 0.9s — кнопки, ещё через 0.9s — co-founders и футер
5. `prefers-reduced-motion` → всё показывается сразу

Центрирование меряется после `document.fonts.ready` (fallback 900мс). Сдвиг через
transform — раскладка не прыгает. Тайминги — в `startIntro()` / `finishIntro()`.

## Управление галереей

- **Тач**: нативный свайп (scroll-snap center)
- **Мышь drag**: pointerdown → тянуть; snap отключается на время drag, потом доснап
  к ближайшей карточке; клик после drag >8px не запускает видео
- **Колёсико**: 1 щелчок = 1 карточка (порог 40 delta, троттлинг 450мс)
- **Клавиатура**: ← / →
- Стрелки и счётчик `01/26` удалены сознательно (лишний UI)
- Тап по карточке = play/pause; unmute глушит остальные; видео вне вьюпорта паузятся
- Размер карточки считает JS (`sizeCards()`) от реальной высоты `.rail-wrap`
  через ResizeObserver — не через vh

## Панели (Who we are / What we do / Get in touch)

`<template id="tpl-who|what|touch">` + оверлей-диалог с ретро-тайтлбаром.
Закрытие: ✕, повторный клик по кнопке, клик мимо, Esc.

- **Who we are** — текст от первого лица «ATH is a duo…» (авторский текст владельцев)
- **What we do** — 4 строки: AI trailers / Product & promo / Event coverage / Always-on partner
- **Get in touch** — только ссылки: athmedia21@gmail.com, @athcamera, Calendly.
  Formspree-форма из v2 удалена.

## Оптимизация медиа

- **Постеры**: все ≤1280px, q82 → 6.8 MB → **3.1 MB** (27 jpg)
- **Hero-постер** `status_2044066170471624711_1_hero.jpg` был битым файлом
  (UTF-16-манглинг, битый и в git — на проде никогда не работал) → перегенерирован
  из кадра видео @1s. В новом дизайне не используется, но файл починен.
- **4 видео с битрейтом >1.5 Mbps** пережаты (h264 CRF 26, +faststart):
  - `status_2061408037789913499_1` 19.6 → 12.9 MB
  - `status_2037549403414646827_1` 18.8 → 12.8 MB
  - `status_2072637765699977466_1` 15.3 → 10.0 MB
  - `status_2052767900910731569_1` 15.2 → 10.2 MB
- Metaplex (16 MB) и Pudgy (14 MB) НЕ трогал — длинные видео с уже низким
  битрейтом 0.8–0.9 Mbps, пережим только испортит качество
- Постеры карточек грузятся лениво (IntersectionObserver, только возле вьюпорта)
- Оригиналы: `videos/raw/backup-2026-07-04/` (gitignored)

## SEO / аналитика — сохранено из v2

- JSON-LD `@graph`: ProfessionalService + 26 VideoObject (описание обновлено под новый слоган)
- Все meta/OG/Twitter-теги (описания = новый слоган), canonical, google-site-verification
- Umami-аналитика

## Как редактировать

| Что | Где |
|-----|-----|
| Порядок/состав галереи | `index.html` → `const items = [...]` (~строка 435) |
| Тексты панелей | `index.html` → `<template id="tpl-...">` |
| Слоган | `sloganFull` в JS + meta-описания (6 мест, искать по тексту слогана) |
| Тайминги intro | `startIntro()` / `finishIntro()` + CSS `.reveal`, `.reveal-x`, `.settle` |
| Ссылки co-founders | блок `.cofounders` |

Новые видео: тот же пайплайн (`WORKFLOW-x-links-to-website.md`), затем добавить
объект в `items` и VideoObject в JSON-LD. Держать битрейт ≤ ~1.5 Mbps / ≤1280w.

## Откат

Старый лендинг v2 — в git-истории: `git show 16aac16:index.html` (последний коммит до редизайна).
