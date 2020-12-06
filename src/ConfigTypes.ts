import { createTransport } from 'nodemailer';

//
// Type declarations
//
export interface JobConfig {
  notifiers: Notifiers[];
  urls: UrlConfig[];
  user_agent?: string;
  cache_dir?: string;
  proxy?: string;
}

export interface UrlConfig {
  name: string;
  location: string;
  filter?: (content: string) => string;
  postData?: any;
  user_agent?: string;
}

export interface PushoverNotifier {
  notifierType: 'PUSHOVER';
  pushoverUser: string;
  pushoverToken: string;
}

export interface ConsoleNotifier {
  notifierType: 'CONSOLE';
}

export type Notifiers = PushoverNotifier | ConsoleNotifier;