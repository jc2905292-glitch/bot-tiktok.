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

    // ALERTA AL ADMINISTRADOR: INICIO EL BOT
    if (chatId.toString() !== ADMIN_ID) {
        const alertaAdmin = `🔔 *NUEVO USUARIO*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n💬 Acción: Entró al bot (/start)`;
        bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
    }

    const mensajeBienvenida = `¡Hola, ${firstName}! 👋 Bienvenido al sistema automatizado de Cupones TikTok.\n\nElige una de las opciones abajo para comenzar:`;

    const opcionesBotones = {
        reply_markup: {
            inline_keyboard: [
                // AHORA ESTE BOTÓN ES INTERNO PARA PODER RASTREAR EL CLIC
                [{ text: "🌐 Iniciar Método (Ir a la Web)", callback_data: "iniciar_metodo" }],
                [{ text: "📱 Ver Requisitos de iOS", callback_data: "requisitos" }],
                [{ text: "🆘 Contactar Administrador", url: "https://t.me/wilmerlucena" }] 
            ]
        }
    };

    bot.sendMessage(chatId, mensajeBienvenida, opcionesBotones);
});

// RESPUESTAS A LOS CLICS DE LOS BOTONES
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const firstName = query.from.first_name;
    const username = query.from.username ? `@${query.from.username}` : 'Sin usuario';

    // SI TOCA "VER REQUISITOS"
    if (query.data === 'requisitos') {
        
        // ALERTA AL ADMINISTRADOR: VIO REQUISITOS
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🖱️ *NUEVO CLIC*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n👆 Acción: Vio los requisitos de iOS`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
        }

        const mensajeRequisitos = "⚠️ *REQUISITOS IMPORTANTES:*\n\n1️⃣ Exclusivo para dispositivos iPhone (iOS).\n2️⃣ Necesitarás cambiar la región de tu teléfono a USA.\n3️⃣ Te daremos un VPN y dirección de casillero durante el registro en nuestra web.\n\n¡Si cumples con esto, toca el botón 🌐 *Iniciar Método*!";
        bot.sendMessage(chatId, mensajeRequisitos, { parse_mode: 'Markdown' });
    }

    // SI TOCA "INICIAR MÉTODO"
    if (query.data === 'iniciar_metodo') {
        
        // ALERTA AL ADMINISTRADOR: INICIÓ MÉTODO
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🚀 *NUEVO CLIC EN INICIAR*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n🌐 Acción: Hizo clic para ir a la Página Web`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
        }

        // LE DAMOS EL ACCESO REAL A LA PÁGINA AL USUARIO
        const mensajeIrWeb = "Excelente decisión. 🌐\n\nToca el botón de abajo para entrar a nuestra plataforma segura y comenzar el proceso:";
        const botonWeb = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👉 ENTRAR A LA PÁGINA WEB 👈", url: "https://cuponestiktok-8b7cb.web.app" }]
                ]
            }
        };
        bot.sendMessage(chatId, mensajeIrWeb, botonWeb);
    }

    // Le decimos a Telegram que ya respondimos al clic para que no se quede cargando
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
