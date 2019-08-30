import { Schema, Document, model } from 'mongoose';

export interface IMessage extends Document {
  message: string;
  date: Date;
  user: string;
  chat: string;
}

const Message: Schema = new Schema<IMessage>({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String, required: true },
  chat: { type: String, required: true }
});

export default model<IMessage>('Message', Message);
