import { SmtpOptions } from "nodemailer-smtp-transport";

//
// Type declarations
//
export interface IJobConfig {
  email: IEmailConfig;
  urls: IUrlConfig[];
  user_agent?: string;
  cache_dir?: string;
  proxy?: string;
}

export interface IEmailConfig {
  smtp: SmtpOptions;
  options: IEmailOptionsConfig;
}

export interface IEmailOptionsConfig {
  fromEmailAddress?: string;
  toEmailAddress?: string;
}

export interface IUrlConfig {
  name: string;
  location: string;
  filter?: (content: string) => string;
  postData?: any;
  user_agent?: string;
}
