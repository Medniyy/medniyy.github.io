# 🚀 DEPLOY ИНСТРУКЦИЯ (3 ШАГА)

## ШАГ 1: Залить Frontend (5 минут)

### Вариант A: Netlify (ПРОЩЕ ВСЕГО)

1. **Открой Netlify**: https://app.netlify.com/drop

2. **Перетащи эти файлы** прямо в окно браузера:
   - `index.html`
   - `bags-logo.png`

3. **Получишь ссылку**: типа `random-name-123.netlify.app`

4. **Готово!** Сайт уже работает

### Вариант B: Vercel

1. **Открой Vercel**: https://vercel.com/new
2. Залей файлы через GitHub или direct upload
3. Deploy → получишь `.vercel.app` ссылку

---

## ШАГ 2: Deploy Backend API (10 минут)

### Что нужно:
- Cloudflare аккаунт (бесплатный)
- Helius API key (бесплатный)

### 2.1: Получи Helius API Key

1. **Регистрация**: https://helius.dev
2. **Create Project** → скопируй API key
3. **Free tier**: 100,000 requests/day

### 2.2: Deploy Cloudflare Worker

**Способ 1: Dashboard (NO CODE)**

1. Открой: https://dash.cloudflare.com
2. Workers & Pages → Create Worker
3. Имя: `bags-shark-tank-api`
4. Edit Code → **скопируй весь код из `worker.js`**
5. Замени `YOUR_HELIUS_API_KEY_HERE` на твой key
6. Save and Deploy
7. **Скопируй URL** типа `bags-shark-tank-api.yourname.workers.dev`

**Способ 2: Wrangler CLI (если знаком с терминалом)**

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

### 2.3: Обнови Frontend

В `index.html` (строка 83) замени:
```javascript
const API_ENDPOINT='https://bags-shark-tank-api.athcamera.workers.dev';
```

На твой Worker URL:
```javascript
const API_ENDPOINT='https://bags-shark-tank-api.ТВОЙ_USERNAME.workers.dev';
```

Перезалей на Netlify (drag & drop снова).

---

## ШАГ 3: Найти bags.fm Program ID (20 минут)

### Зачем?
Чтобы парсить реальные токены вместо demo данных.

### Как найти:

**Метод 1: Solscan**
1. Иди на https://solscan.io
2. Найди любую bags.fm транзакцию
3. Смотри "Program" field
4. Это и есть program ID

**Метод 2: Спроси комьюнити**
1. Discord: https://discord.gg/bags (если есть)
2. Telegram: @BagsApp
3. Twitter: @bags_fm
4. Спроси: "What's the bags.fm program ID?"

**Метод 3: Reverse-engineer**
1. Открой https://bags.fm
2. Открой Developer Tools (F12)
3. Network tab → ищи RPC calls
4. Найди program ID в requests

### После того как найдешь:

В `worker.js` замени:
```javascript
const BAGS_PROGRAM = 'BagsProgram1111111111111111111111111111111';
```

На реальный:
```javascript
const BAGS_PROGRAM = 'ТВОЙ_НАЙДЕННЫЙ_PROGRAM_ID';
```

Redeploy worker через dashboard или `wrangler deploy`.

---

## ✅ ПРОВЕРКА ЧТО ВСЁ РАБОТАЕТ

### Frontend работает?
✅ Открой свой Netlify URL
✅ Должен показать интерфейс
✅ Кнопки должны быть кликабельными

### Wallet Connect работает?
✅ Установи Phantom/Solflare
✅ Кликни "Connect Wallet"
✅ Должно показать адрес

### API работает?
✅ Открой твой Worker URL напрямую
✅ Должен вернуть JSON с токенами
✅ Если нет — проверь Helius key

### Buy кнопка работает?
✅ Кликни на токен → "Buy"
✅ Должен открыть Jupiter
✅ С pre-filled mint address

### Tweet кнопка работает?
✅ Кликни "Tweet"
✅ Должен скачать PNG
✅ Открыть Twitter

---

## 🐛 TROUBLESHOOTING

### "No tokens showing"
→ Worker не работает. Проверь Helius key в dashboard.

### "API unavailable"
→ Worker URL не добавлен в HTML. Проверь строку 83.

### "Wallet not connecting"
→ User needs to install wallet extension first.

### "Demo data showing"
→ Нормально! Значит bags.fm program ID ещё не найден или Worker возвращает fallback.

---

## 💰 COSTS

**Текущий setup - 100% БЕСПЛАТНО:**
- Netlify: Free tier
- Cloudflare Workers: 100k requests/day free
- Helius: 100k requests/day free

**Если масштабируешь:**
- Helius Pro: $50/month (unlimited)
- Cloudflare Workers: $5/10M requests
- Netlify Pro: $19/month (custom domain, analytics)

---

## 🎯 QUICK START (если спешишь)

**5-минутный вариант:**

1. Залей `index.html` + `bags-logo.png` на Netlify → получи ссылку
2. Сайт работает в demo mode с fake токенами
3. Wallet connect работает
4. Buy/Tweet работает

**Этого достаточно для:**
- Показать клиентам
- Получить feedback
- Протестировать UI

**Потом добавишь:**
- Real API (Шаг 2)
- Real tokens (Шаг 3)

---

## 📞 НУЖНА ПОМОЩЬ?

### Если застрял на Шаге 1-2:
→ Скринь ошибку и кидай мне

### Если не можешь найти program ID:
→ Можно пока работать с demo данными
→ Или найди dev из bags.fm комьюнити

### Если хочешь я сделал всё:
→ Пришли мне:
  - Твой Netlify URL
  - Твой Cloudflare email
→ Я настрою Worker и дам инструкции

---

## 🚀 ЧТО ДАЛЬШЕ?

После деплоя:

1. **Custom Domain**
   - Netlify: Settings → Domain management
   - Добавь `sharktank.bags.fm` (если есть доступ)

2. **Analytics**
   - Google Analytics
   - Или Plausible (privacy-friendly)

3. **Real-time Updates**
   - Добавь WebSocket в Worker
   - Auto-refresh каждые 30 сек

4. **Mobile App**
   - Wrap в React Native
   - Или PWA (Progressive Web App)

5. **Monetization**
   - Affiliate links для Jupiter swaps
   - Premium features (alerts, portfolio tracking)

---

НАЧИНАЙ С ШАГА 1. САЙТ ЗАРАБОТАЕТ ЗА 5 МИНУТ.