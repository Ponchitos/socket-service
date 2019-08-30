import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  tempPassword: string;
  role: string;
  active: boolean;
}

const UserSchema: Schema = new Schema<IUser>({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  passwordSalt: { type: String },
  tempPassword: { type: String },
  role: { type: String },
  active: { type: Boolean, default: false }
});

export default model<IUser>('User', UserSchema);
