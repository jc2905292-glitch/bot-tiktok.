const TelegramModule = require('node-telegram-bot-api');
const express = require('express');

const TelegramBot = TelegramModule.default || TelegramModule;
const token = '8861335056:AAGADyWosP04HXQZp0rZuxMlJeABeQxgXNg';
const ADMIN_ID = '8264753970'; 

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const username = msg.from.username ? `@${msg.from.username}` : 'Sin usuario';

    if (chatId.toString() !== ADMIN_ID) {
        const alertaAdmin = `🔔 *NUEVO USUARIO*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n💬 Acción: Entró al bot (/start)`;
        bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
    }

    // TEXTO ACTUALIZADO CON EXPLICACIÓN PARA DAR CONFIANZA
    const mensajeBienvenida = `¡Hola, ${firstName}! 👋 Bienvenido al sistema automatizado de Cupones TikTok.\n\n⚠️ *AVISO:* Solo nos quedan *12 cupos* disponibles para activar el método premium esta semana.\n\n💡 *¿Por qué cambiamos la Región y usamos VPN?*\nLos cupones y los pagos más altos de TikTok son exclusivos para el mercado de Estados Unidos. Al hacer esta configuración, le permitimos a tu teléfono acceder a estas recompensas VIP de forma 100% segura, legal y reversible.\n\nElige una de las opciones abajo para comenzar:`;

    const opcionesBotones = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌐 Iniciar Método (Ir a la Web)", callback_data: "iniciar_metodo" }],
                [{ text: "📱 Ver Requisitos de iOS", callback_data: "requisitos" }],
                [{ text: "🎁 Ganar Puntos por Invitar", callback_data: "info_referidos" }],
                [{ text: "💬 Unirse al Canal de Dudas", url: "https://t.me/+G7a47oWfVVgwZWYx" }],
                [{ text: "🆘 Contactar Administrador", url: "https://t.me/wilmerlucena" }] 
            ]
        }
    };

    bot.sendMessage(chatId, mensajeBienvenida, opcionesBotones);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const firstName = query.from.first_name;
    const username = query.from.username ? `@${query.from.username}` : 'Sin usuario';

    if (query.data === 'requisitos') {
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🖱️ *NUEVO CLIC*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n👆 Acción: Vio los requisitos de iOS`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
        }

        const mensajeRequisitos = "⚠️ *REQUISITOS IMPORTANTES:*\n\n1️⃣ Exclusivo para dispositivos iPhone (iOS).\n2️⃣ Necesitarás cambiar la región de tu teléfono a USA.\n3️⃣ Te daremos un VPN y dirección de casillero en nuestra web.\n\n🎁 *RECOMPENSA:* Completar los pasos te otorgará *1000 Puntos* para reclamar tus beneficios.\n\n¡Si cumples con esto, toca el botón 🌐 *Iniciar Método* rápido para no perder tu cupo!";
        bot.sendMessage(chatId, mensajeRequisitos, { parse_mode: 'Markdown' });
    }

    // NUEVA RESPUESTA PARA EL BOTÓN DE REFERIDOS
    if (query.data === 'info_referidos') {
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🖱️ *NUEVO CLIC*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n👆 Acción: Vio la info de Referidos`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(e=>{});
        }
        
        const mensajeReferidos = "🤝 *PROGRAMA DE INVITADOS*\n\n¡No solo ganas por completar tus pasos! Una vez que te registres en nuestra web, recibirás un *Enlace Único*.\n\nPor cada amigo que se registre con tu enlace, sumarás *100 Puntos Extra* a tu cuenta de forma automática.\n\n👉 Toca *Iniciar Método* para registrarte y sacar tu enlace.";
        bot.sendMessage(chatId, mensajeReferidos, { parse_mode: 'Markdown' });
    }

    if (query.data === 'iniciar_metodo') {
        if (chatId.toString() !== ADMIN_ID) {
            const alertaAdmin = `🚀 *NUEVO CLIC EN INICIAR*\n👤 Nombre: ${firstName}\n🔗 Usuario: ${username}\n🌐 Acción: Hizo clic para ir a la Página Web`;
            bot.sendMessage(ADMIN_ID, alertaAdmin, { parse_mode: 'Markdown' }).catch(err => console.log(err));
        }

        const mensajeIrWeb = "Excelente decisión. 🌐\n\nToca el botón de abajo para entrar a nuestra plataforma segura y ganar tus primeros 200 puntos hoy mismo:";
        const botonWeb = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👉 ENTRAR A LA PÁGINA WEB 👈", url: "https://cuponestiktok-8b7cb.web.app" }]
                ]
            }
        };
        bot.sendMessage(chatId, mensajeIrWeb, botonWeb);
    }
    bot.answerCallbackQuery(query.id);
});

const app = express();
app.get('/', (req, res) => { res.send('✅ El bot de Telegram está encendido y funcionando 24/7.'); });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🌐 Servidor web fantasma encendido en el puerto ${PORT}`); });
