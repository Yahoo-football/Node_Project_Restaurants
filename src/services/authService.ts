import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import authRepository from '../repositories/authRepositories.js';
import {
  type AuthTokenPayload,
  type LoginInput,
  type PublicUser,
  type RegisterUserInput,
  type UserRecord,
  type UserRole,
  User,
} from '../models/userModel.js';

class AuthService {
  private readonly allowedRoles: UserRole[] = ['admin', 'staff', 'customer'];

  public async register(data: RegisterUserInput): Promise<{ token: string; user: PublicUser }> {
    this.validateRegistrationInput(data);

    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const sanitizedPhone = data.phone?.trim();
    const createdUser = await authRepository.createUser({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      password: hashedPassword,
      role: data.role ?? 'customer',
      ...(sanitizedPhone ? { phone: sanitizedPhone } : {}),
    });

    return this.buildAuthResponse(createdUser);
  }

  public async login(data: LoginInput): Promise<{ token: string; user: PublicUser }> {
    this.validateLoginInput(data);

    const userRecord = await authRepository.findUserByEmail(data.email.toLowerCase().trim());
    if (!userRecord) {
      throw new Error('Invalid email or password');
    }

    const passwordMatches = await this.comparePassword(data.password, userRecord.password);
    if (!passwordMatches) {
      throw new Error('Invalid email or password');
    }

    return this.buildAuthResponse(userRecord);
  }

  public async getCurrentUser(userId: number): Promise<PublicUser> {
    const userRecord = await authRepository.findUserById(userId);
    if (!userRecord) {
      throw new Error('User not found');
    }

    return new User(userRecord).toPublicObject();
  }

  private validateRegistrationInput(data: RegisterUserInput): void {
    if (!data.name?.trim()) {
      throw new Error('Name is required');
    }

    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (data.role && !this.allowedRoles.includes(data.role)) {
      throw new Error('Invalid role');
    }
  }

  private validateLoginInput(data: LoginInput): void {
    if (!data.email?.trim() || !data.password) {
      throw new Error('Email and password are required');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await this.scrypt(password, salt);

    return `${salt}:${derivedKey}`;
  }

  private async comparePassword(password: string, storedPassword: string): Promise<boolean> {
    const [salt, originalHash] = storedPassword.split(':');

    if (!salt || !originalHash) {
      return false;
    }

    const derivedKey = await this.scrypt(password, salt);
    return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(derivedKey, 'hex'));
  }

  private scrypt(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey.toString('hex'));
      });
    });
  }

  private buildAuthResponse(userRecord: UserRecord): { token: string; user: PublicUser } {
    const user = new User(userRecord);
    const payload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: jwt.sign(payload, this.getJwtSecret(), { expiresIn: '1d' }),
      user: user.toPublicObject(),
    };
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return secret;
  }
}

export default new AuthService();
