import { SmtpOptions } from "nodemailer-smtp-transport";

//
// Type declarations
//
export interface JobConfig {
  email?: EmailConfig;
  urls: UrlConfig[];
  user_agent?: string;
  cache_dir?: string;
  proxy?: string;
}

export interface EmailConfig {
  smtp: SmtpOptions;
  options: EmailOptionsConfig;
}

export interface EmailOptionsConfig {
  fromEmailAddress?: string;
  toEmailAddress?: string;
}

export interface UrlConfig {
  name: string;
  location: string;
  filter?: (content: string) => string;
  postData?: any;
  user_agent?: string;
}
