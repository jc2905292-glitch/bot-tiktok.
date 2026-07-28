const TelegramModule = require('node-telegram-bot-api');
const express = require('express');

const TelegramBot = TelegramModule.default || TelegramModule;

const token = '8861335056:AAGADyWosP04HXQZp0rZuxMlJeABeQxgXNg';

// Tu ID de Administrador ya configurado
const ADMIN_ID = '8264753970'; 

const bot = new TelegramBot(token, {polling: true});

// CUANDO EL USUARIO ESCRIBA /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const username = msg.from.username ? `@${msg.from.username}` : 'Sin usuario';

    // ALERTA AL ADMINISTRADOR
    if (chatId.toString() !== ADMIN_ID) {
        const alertaAdmin = `🔔 *NUEVO USUARIO*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n💬 Acción: Entró al bot (/start)`;
        bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
    }

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
    const firstName = query.from.first_name;
    const username = query.from.username ? `@${query.from.username}` : 'Sin usuario';

    if (query.data === 'requisitos') {
        
        // ALERTA AL ADMINISTRADOR
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🖱️ *NUEVO CLIC*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n👆 Acción: Vio los requisitos de iOS`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
        }

        const mensajeRequisitos = "⚠️ *REQUISITOS IMPORTANTES:*\n\n1️⃣ Exclusivo para dispositivos iPhone (iOS).\n2️⃣ Necesitarás cambiar la región de tu teléfono a USA.\n3️⃣ Te daremos un VPN y dirección de casillero durante el registro en nuestra web.\n\n¡Si cumples con esto, toca el botón 🌐 *Iniciar Método*!";
        bot.sendMessage(chatId, mensajeRequisitos, { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(query.id);
});

// ==========================================
// SERVIDOR WEB FANTASMA PARA EL HOSTING
// ==========================================
const app = express();

app.get('/', (req, res) => {
    res.send('✅ El bot de Telegram está encendido y funcionando 24/7.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor web fantasma encendido en el puerto ${PORT}`);
    console.log("🤖 ¡Bot de Telegram encendido y esperando mensajes!");
});
