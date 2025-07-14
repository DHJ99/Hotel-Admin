import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { logger } from '../utils/logger';
import { authSchemas } from '../utils/validation';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = authSchemas.register.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { email, password, name, phone, bio } = value;

      // Check if user already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(409).json({ error: 'User already exists with this email' });
        return;
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = uuidv4();
      await db.query(
        `INSERT INTO users (id, email, password_hash, name, phone, bio) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, email, passwordHash, name, phone, bio]
      );

      // Generate JWT token
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info('User registered successfully', { userId, email });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          email,
          name,
          phone,
          bio,
          role: 'admin'
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = authSchemas.login.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { email, password } = value;

      // Find user
      const result = await db.query(
        'SELECT id, email, password_hash, name, role, phone, bio, profile_picture FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info('User logged in successfully', { userId: user.id, email });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          profile_picture: user.profile_picture
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      const result = await db.query(
        'SELECT id, email, name, role, phone, bio, profile_picture, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user: result.rows[0] });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { name, phone, bio, profile_picture } = req.body;

      const result = await db.query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             phone = COALESCE($2, phone), 
             bio = COALESCE($3, bio),
             profile_picture = COALESCE($4, profile_picture),
             updated_at = NOW()
         WHERE id = $5 
         RETURNING id, email, name, role, phone, bio, profile_picture`,
        [name, phone, bio, profile_picture, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      logger.info('Profile updated successfully', { userId });
      res.json({ 
        message: 'Profile updated successfully',
        user: result.rows[0] 
      });

    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const authController = new AuthController();