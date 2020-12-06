import { ConsoleNotifier, Notifiers, PushoverNotifier } from "ConfigTypes";
import fetch from 'node-fetch';

export const send_notification = async (notifiers: Notifiers[], subject: string, message: string) => {
  for (const notifier of notifiers) {
    const notifierType = notifier.notifierType
    switch (notifier.notifierType) {
      case 'CONSOLE':
        send_console_notification(notifier, subject, message);
        break;
      case 'PUSHOVER':
        await send_pushover_notification(notifier, subject, message);
        break;
      default:
        console.log(`Notifier type not found! ${notifierType}`);
    }
  }
};

const send_console_notification = (config: ConsoleNotifier, subject: string, message: string) => {
  console.log(subject);
  console.log('====================================================');
  console.log(message);
};

const send_pushover_notification = async (config: PushoverNotifier, subject: string, message: string) => {
  const url = `https://api.pushover.net/1/messages.json`
  const body = {
    user: config.pushoverUser,
    token: config.pushoverToken,
    title: subject,
    message
  };
  const request: RequestInit = { 
    method: 'POST', 
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  };
  const response = fetch(url, request);
  const responseText = await (await response).text();
  console.log(responseText);
};

interface PushoverConfig {
  pushoverUser: string;
  pushoverToken: string;
}
