import uuidv4 from 'uuid/v4';

export type IChat = {
  userUuid: string;
  name: string;
  description: string;
  uuid?: string;
  dateCreate?: Date;
}

export default class Chat {
  private _name: string;
  private _userUuid: string;
  private _uuid: string;
  private _description: string;
  private _dateCreate: Date;

  constructor(data: IChat) {
    this._name = data.name;
    this._userUuid = data.userUuid;
    this._description = data.description;
    this._uuid = data.uuid || uuidv4();
    this._dateCreate = data.dateCreate || new Date();
  }

  get name(): string {
    return this._name;
  }

  get uuid(): string {
    return this._uuid;
  }

  get userUuid(): string {
    return this._userUuid;
  }

  get description(): string {
    return this._description;
  }

  get dateCreate(): Date {
    return this._dateCreate;
  }

  toString(): string {
    return JSON.stringify({
      name: this.name,
      uuid: this.uuid,
      userUuid: this.userUuid,
      description: this.description,
      dateCreate: this.dateCreate
    });
  }
}
