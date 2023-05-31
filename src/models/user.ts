import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import IUser from '../interfaces/IUser';
import { SALT_FACTOR } from '../config';

interface IUserDB extends IUser, Document {}

const UserSchema = new mongoose.Schema({
  profile: {
    type: Object,
    default: {
      age: null,
      gender: null,
      email: null,
      phone: null,
      address: null
    }
  },
  username: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: String,
  deleted: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: ''
  },
  roles: {
    type: Array,
    default: ['user']
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function (next) {
  try {
    const user = this as any;
    // only hash the password if it has been modified (or is new) and has password
    if (user.isModified('password') || !!user.password) {
      const salt = await bcrypt.genSalt(SALT_FACTOR);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }

    // validate roles to always be sure contain user role
    if (user.isModified('roles') || !!user.roles) {
      user.roles = Array.isArray(user.roles) ? user.roles : ['user'];
      if (!user.roles.includes('user')) {
        user.roles = ['user', ...user.roles];
      }
    }

    return next();
  } catch (error: any) {
    return next(error);
  }
});

async function isValidPassword(this: any, candidatePassword: string) {
  const user = this as any;
  // if no password is set, then any password is invalid
  if (user.password) {
    return bcrypt.compare(candidatePassword, user.password);
  }
  return false;
};

UserSchema.methods.isValidPassword = isValidPassword;

const UserModel = mongoose.model('User', UserSchema);

export { IUserDB, UserModel };
export default UserModel;
