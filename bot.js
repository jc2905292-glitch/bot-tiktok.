const TelegramModule = require('node-telegram-bot-api');
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc } = require('firebase/firestore');

// 👇 INICIALIZAR FIREBASE EN EL BOT 👇
const firebaseConfig = { apiKey: "AIzaSyDyyq2FR1ruQWlm954gH1Q0Y3KFIUn8-E4", authDomain: "cuponestiktok-8b7cb.firebaseapp.com", projectId: "cuponestiktok-8b7cb", storageBucket: "cuponestiktok-8b7cb.firebasestorage.app", messagingSenderId: "445103664448", appId: "1:445103664448:web:a21a5441149505ed0b1ea5" };
const appFire = initializeApp(firebaseConfig);
const db = getFirestore(appFire);

const TelegramBot = TelegramModule.default || TelegramModule;
const token = '8861335056:AAGADyWosP04HXQZp0rZuxMlJeABeQxgXNg';
const ADMIN_ID = '8264753970'; 

const bot = new TelegramBot(token, {polling: true});
const listaUsuariosBot = new Set();
const usuariosIniciados = new Set(); 

// Lógica de Notificaciones de Pasos y Bot Auto-Aprobador
let botAutoActivo = false;
onSnapshot(doc(db, "config", "admin"), (docSnap) => {
    if (docSnap.exists()) botAutoActivo = docSnap.data().botActivo;
});

const rastreoPasos = new Map();

onSnapshot(collection(db, "usuarios"), (snapshot) => {
    snapshot.docs.forEach((docSnap) => {
        const user = docSnap.data();
        const uid = docSnap.id;
        const currentPaso = user.pasoActual;
        
        // 1. NOTIFICACIONES A TELEGRAM
        if (rastreoPasos.has(uid)) {
            const oldPaso = rastreoPasos.get(uid);
            if (currentPaso > oldPaso && currentPaso <= 6) {
                if (user.telegramChatId) {
                    let msg = "";
                    if (currentPaso > 5) {
                        msg = "🎉 *¡PROCESO COMPLETADO!*\n\nTodos tus pasos fueron aprobados. Acabas de ganar otros $1 USD.\n\n💰 Revisa tu billetera web, ya puedes solicitar tu retiro o seguir invitando amigos.";
                    } else {
                        msg = `✅ *¡Paso ${oldPaso} Aprobado!*\n\n💸 Has ganado *$1 USD* que ya está en tu Billetera.\n👉 Entra a la web rápido para continuar con tu siguiente paso.`;
                    }
                    bot.sendMessage(user.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(e=>{});
                }
            }
        }
        rastreoPasos.set(uid, currentPaso);

        // 2. BOT AUTO-APROBADOR
        if (botAutoActivo && user.estadoPaso === "revision") {
            setTimeout(async () => {
                try {
                    await updateDoc(doc(db, "usuarios", uid), {
                        pasoActual: currentPaso + 1,
                        estadoPaso: "pendiente"
                    });
                } catch(e) { console.log(e); }
            }, 6000); // 6 segundos de retraso para que parezca humano
        }
    });
});

// Mensajes del Bot Base
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    listaUsuariosBot.add(chatId);

    const mensajeBienvenida = `¡Hola, ${firstName}! 👋 Bienvenido al sistema de recompensas TikTok.\n\n⚠️ *AVISO:* Solo nos quedan *12 cupos* disponibles para activar el método esta semana.\n\n💡 *¿Por qué cambiamos la Región y usamos VPN?*\nPara conectar tu teléfono con el mercado de Estados Unidos y acceder a cupones en dólares de forma legal y reversible.\n\n🚫 *IMPORTANTE:* ¡Nunca abras la app de TikTok sin la región de EE.UU. y el VPN activo! Si lo haces perderás tus beneficios.\n\nElige una opción:`;

    const botones = [
        [{ text: "🌐 Iniciar Método (Ir a la Web)", callback_data: "iniciar_metodo" }],
        [{ text: "🎁 Ganar Dólares por Invitar", callback_data: "info_referidos" }],
        [{ text: "💬 Unirse al Canal", url: "https://t.me/+G7a47oWfVVgwZWYx" }]
    ];

    if (chatId.toString() === ADMIN_ID) {
        botones.push([{ text: "📢 ADMIN: Enviar Aviso de Cupos", callback_data: "masivo_cupos" }]);
        botones.push([{ text: "🔔 ADMIN: Despertar Inactivos", callback_data: "masivo_inactivos" }]);
    }
    bot.sendMessage(chatId, mensajeBienvenida, { reply_markup: { inline_keyboard: botones } });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    listaUsuariosBot.add(chatId);

    if (query.data.startsWith('masivo_') && chatId.toString() === ADMIN_ID) {
        let mensajeMasivo = query.data === 'masivo_cupos' 
            ? "⚠️ *¡ATENCIÓN!*\nQuedan muy pocos cupos. Entra a la web, sube tus capturas y gana tus dólares."
            : "👀 *¡Aún guardamos tu cupo!*\nVi que iniciaste el bot pero no entraste a la web. \n\n👉 Toca 'Iniciar Método' en el menú ahora mismo.";
        let esInactivos = query.data === 'masivo_inactivos';

        bot.sendMessage(ADMIN_ID, `⏳ Enviando anuncio...`);
        listaUsuariosBot.forEach(uId => {
            if (!esInactivos || (!usuariosIniciados.has(uId) || uId.toString() === ADMIN_ID)) {
                bot.sendMessage(uId, `📢 *ANUNCIO:* \n\n${mensajeMasivo}`, { parse_mode: 'Markdown' }).catch(e=>{});
            }
        });
        bot.answerCallbackQuery(query.id); return;
    }

    if (query.data === 'iniciar_metodo') {
        usuariosIniciados.add(chatId);
        // 👇 SE AÑADE ?tgid= AL ENLACE PARA VINCULAR LA CUENTA 👇
        const botonWeb = { reply_markup: { inline_keyboard: [[{ text: "👉 ENTRAR A LA PÁGINA WEB 👈", url: `https://cuponestiktok-8b7cb.web.app?tgid=${chatId}` }]] } };
        bot.sendMessage(chatId, "Excelente decisión. 🌐\n\nToca el botón para registrarte y empezar a sumar dólares en tu billetera:", botonWeb);
    }

    if (query.data === 'info_referidos') {
        bot.sendMessage(chatId, "🤝 *PROGRAMA DE INVITADOS*\n\n¡Gana $1 USD por cada persona que invites a usar la guía!\n\nAl registrarte, la web te dará tu enlace único. Cópialo, compártelo y mira tu billetera crecer.", { parse_mode: 'Markdown' });
    }
    bot.answerCallbackQuery(query.id);
});

const app = express(); app.get('/', (req, res) => { res.send('Bot Activo'); }); app.listen(process.env.PORT || 3000, () => {});
