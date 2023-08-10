const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new TelegramBot('6365691470:AAGe1s5Y12roOTXTunwUCwEsXyrfrAKL6VU', { polling: true });


// Replace with your actual chat IDs
const ladyChatId = '1828481170';
const webAdminChatIds = [
  '6288849810',
  'WEBADMIN_CHAT_ID_B',
  'WEBADMIN_CHAT_ID_C',
  'WEBADMIN_CHAT_ID_D',
  'WEBADMIN_CHAT_ID_E',
  'WEBADMIN_CHAT_ID_F'
];


// Store user answers temporarily
const userAnswers = {};

// When a message is received
bot.on('message', (msg) => {
  const chatId = msg.chat.id; // The chat ID of the sender
  const phoneNumber = msg.contact ? msg.contact.phone_number : null; // Extract the phone number


// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome! To start a new offer, type 'NEW OFFER' in ALL CAPS.");
});

// Listen for 'NEW OFFER' message
bot.onText(/NEW OFFER/, (msg) => {
  const chatId = msg.chat.id;
  userAnswers[chatId] = {};

  bot.sendMessage(chatId, "Please provide the lady's HKDUP ID (copy and paste carefully from profile page):");
});


// Listen for user messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact ? msg.contact.phone_number : null; // Extract the phone number
  const message = msg.text;

  if (!userAnswers[chatId]) {
    userAnswers[chatId] = {};
  }

  if (!userAnswers[chatId].step) {
    userAnswers[chatId].step = 1;
  }

// Check if the message contains an image
  if (msg.photo && msg.photo.length > 0) {
    const photo = msg.photo[msg.photo.length - 1];
    userAnswers[chatId].image = photo.file_id; // Store the image file ID
  }

  
switch (userAnswers[chatId].step) {
    case 1:
      userAnswers[chatId].ladyHKDUPID = message;
      userAnswers[chatId].step = 2;
      bot.sendMessage(chatId, "Please provide the lady's Username:");
      break;

    case 2:
      userAnswers[chatId].ladyUsername = message;
      userAnswers[chatId].step = 3;
      bot.sendMessage(chatId, "Please provide your Client Name:");
      break;

    case 3:
      userAnswers[chatId].clientName = message;
      userAnswers[chatId].step = 4;
      bot.sendMessage(chatId, "Please provide the DATE for service (Use Sample Format- '14th Feb, 2023):");
      break;

    case 4:
      userAnswers[chatId].date = message;
      userAnswers[chatId].step = 5;
      bot.sendMessage(chatId, "Please provide your Location (Your City):");
      break;

    case 5:
      userAnswers[chatId].location = message;
      userAnswers[chatId].step = 6;
      bot.sendMessage(chatId, "Please provide the Area (in your city, example: Berger, Challenge, Victoria Island):");
      break;

    case 6:
      // Here you can handle the image attachment from the user
      // Then proceed to the next step
      userAnswers[chatId].image = 'image_path'; // Replace with the actual image path
      userAnswers[chatId].step = 7;
      bot.sendMessage(chatId, "Please select SPECIAL SERVICES:", {
        reply_markup: {
          keyboard: [['None', 'Anal'], ['Titty Fuck', 'Toe Fetish'], ['Dress up & Role Play']]
        }
      });
      break;

    case 7:
      userAnswers[chatId].specialServices = message;
      userAnswers[chatId].step = 8;
      bot.sendMessage(chatId, "Please select DURATION:", {
        reply_markup: {
          keyboard: [['Day', 'Overnight']]
        }
      });
      break;

    case 8:
      userAnswers[chatId].duration = message;
      userAnswers[chatId].step = 9;
      bot.sendMessage(chatId, "Please select OFFER SHELF-LIFE:", {
        reply_markup: {
          keyboard: [['12HRS', '24 HRS.'], ['2 DAYS.', '3 DAYS.'], ['1 WEEK.']]
        }
      });
      break;

    case 9:
      userAnswers[chatId].offerShelfLife = message;
      userAnswers[chatId].step = 10;


      // Generate Order Code
      const orderCode = Math.floor(10000 + Math.random() * 90000);

             // Send the order code to the client
      bot.sendMessage(chatId, `Your Order Code: ${orderCode}`)
        .then(() => {
      // Construct the message
      const message = `
        NEW CLIENT OFFER

        Order Code: ${orderCode}
        Lady's USERNAME: ${userAnswers[chatId].ladyUsername}
        Client name: ${userAnswers[chatId].clientName}
        LOCATION: ${userAnswers[chatId].location}
        Area: ${userAnswers[chatId].area}
        DATE: ${userAnswers[chatId].date}
        SPECIAL SERVICES: ${userAnswers[chatId].specialServices}
        DURATION: ${userAnswers[chatId].duration}
        OFFER SHELF-LIFE:${userAnswers[chatId].offerShelfLife}
      `;

      // Send the message to lady and WebAdmins
      bot.sendMessage(ladyChatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Accept', callback_data: `accept_${orderCode}` },
              { text: 'Reject', callback_data: `reject_${orderCode}` }
            ]
          ]
        }
      });
      webAdminChatIds.forEach(adminChatId => {
        // Send a separate message to WebAdmins with client's phone number and order code
  bot.sendMessage(adminChatId, `ORDER CODE: ${orderCode} CLIENT PHONE NUMBER: ${phoneNumber}`);
  // Send the general message.
        bot.sendMessage(adminChatId, message);
      });

    
      // Set a timeout for additional actions, e.g., accepting or rejecting
          setTimeout(() => {
  // Here you can handle additional actions after the timeout
  // For example, you can display a message if the offer hasn't been accepted or rejected
  bot.sendMessage(chatId, "Please wait for the lady's response.");
}, 300000); // Wait for 5 minutes (adjust the timeout as needed)
                           

      break;

    default:
      // Handle invalid input
      bot.sendMessage(chatId, "Invalid input. Please provide the requested information.");
  }
});

// Listen for button callbacks
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const [action, orderCode] = data.split('_');

  if (action === 'accept') {
    // Send the accepted message to the Telegram channel
    const acceptedMessage = `ACCEPTED\n\n${userAnswers[chatId].message}`;
    bot.sendMessage('https://t.me/hkdupwkly', acceptedMessage);
  } else if (action === 'reject') {
    // Send the rejected message to the Telegram channel
    const rejectedMessage = `REJECTED\n\n${userAnswers[chatId].message}`;
    bot.sendMessage('https://t.me/hkdupwkly', rejectedMessage);
  }
  
});


  // New code insertion point ends here

const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

app.listen(app.get('port'), () => {
  console.log(`Bot is listening on port ${app.get('port')}`);
});
