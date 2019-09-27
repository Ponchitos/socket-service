export type IMessage = {
  user: string;
  chat: string;
  message: string;
  date?: Date;
}

export default class Message {
  private _user: string;
  private _date_create: Date;
  private _chat: string;
  private _message: string;

  constructor(data: IMessage) {
    this._user = data.user;
    this._chat = data.chat;
    this._message = data.message;
    this._date_create = data.date || new Date();
  }

  get user(): string {
    return this._user;
  }

  get date_create(): Date {
    return this._date_create;
  }

  get chat(): string {
    return this._chat;
  }

  get message(): string {
    return this._message;
  }

  toString(): string {
    return JSON.stringify({
      userUuid: this.user,
      chatUuid: this.chat,
      message: this.message,
      date: this.date_create
    });
  }
}
