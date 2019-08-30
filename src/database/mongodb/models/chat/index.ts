import { Schema, Document, model } from 'mongoose';

export interface IChat extends Document {
  uuid: string;
  dateCreate: Date;
  name: string;
  description: string;
  userUuid: string;
}

const ChatSchema: Schema = new Schema<IChat>({
  uuid: { type: String, required: true, unique: true },
  dateCreate: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String, required: true },
  userUuid: { type: String, required: true }
});

export default model<IChat>('Chat', ChatSchema);
