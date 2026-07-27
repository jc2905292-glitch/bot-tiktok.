const TelegramModule = require('node-telegram-bot-api');
const express = require('express'); // NUEVO: Librería para el servidor web

// Trampa para compatibilidad con Node.js v24+
const TelegramBot = TelegramModule.default || TelegramModule;

// Tu Token real
const token = '8861335056:AAGADyWosP04HXQZp0rZuxMlJeABeQxgXNg';

// Crear el bot
const bot = new TelegramBot(token, {polling: true});

// CUANDO EL USUARIO ESCRIBA /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;

    const mensajeBienvenida = `¡Hola, ${firstName}! 👋 Bienvenido al sistema automatizado de Cupones TikTok.\n\nElige una de las opciones abajo para comenzar:`;

    const opcionesBotones = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌐 Iniciar Método (Ir a la Web)", url: "https://cuponestiktok-8b7cb.web.app" }],
                [{ text: "📱 Ver Requisitos de iOS", callback_data: "requisitos" }],
                [{ text: "🆘 Contactar Administrador", url: "https://t.me/wilmerlucena" }] 
            ]
        }
    };

    bot.sendMessage(chatId, mensajeBienvenida, opcionesBotones);
});

// RESPUESTA AL BOTÓN "Ver Requisitos"
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'requisitos') {
        const mensajeRequisitos = "⚠️ *REQUISITOS IMPORTANTES:*\n\n1️⃣ Exclusivo para dispositivos iPhone (iOS).\n2️⃣ Necesitarás cambiar la región de tu teléfono a USA.\n3️⃣ Te daremos un VPN y dirección de casillero durante el registro en nuestra web.\n\n¡Si cumples con esto, toca el botón 🌐 *Iniciar Método*!";
        bot.sendMessage(chatId, mensajeRequisitos, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(query.id);
});

// ==========================================
// NUEVO: SERVIDOR WEB FANTASMA PARA EL HOSTING
// ==========================================
const app = express();

app.get('/', (req, res) => {
    res.send('✅ El bot de Telegram está encendido y funcionando 24/7.');
});

// El hosting nos asignará un puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor web fantasma encendido en el puerto ${PORT}`);
    console.log("🤖 ¡Bot de Telegram encendido y esperando mensajes!");
});