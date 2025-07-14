import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { logger } from '../utils/logger';
import { customerSchemas } from '../utils/validation';

export class CustomerController {
  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, status, room_type, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = 'SELECT * FROM customers WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (status) {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        params.push(status);
      }

      if (room_type) {
        paramCount++;
        query += ` AND room_type = $${paramCount}`;
        params.push(room_type);
      }

      if (search) {
        paramCount++;
        query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(Number(limit), offset);

      const result = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM customers WHERE 1=1';
      const countParams: any[] = [];
      let countParamCount = 0;

      if (status) {
        countParamCount++;
        countQuery += ` AND status = $${countParamCount}`;
        countParams.push(status);
      }

      if (room_type) {
        countParamCount++;
        countQuery += ` AND room_type = $${countParamCount}`;
        countParams.push(room_type);
      }

      if (search) {
        countParamCount++;
        countQuery += ` AND (name ILIKE $${countParamCount} OR email ILIKE $${countParamCount} OR phone ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`);
      }

      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        customers: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      logger.error('Get customers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM customers WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json({ customer: result.rows[0] });

    } catch (error) {
      logger.error('Get customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = customerSchemas.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const customerId = uuidv4();
      const { name, email, phone, check_in, check_out, room_type, total_spent, status } = value;

      const result = await db.query(
        `INSERT INTO customers (id, name, email, phone, check_in, check_out, room_type, total_spent, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [customerId, name, email, phone, check_in, check_out, room_type, total_spent, status]
      );

      logger.info('Customer created successfully', { customerId, name });
      res.status(201).json({ 
        message: 'Customer created successfully',
        customer: result.rows[0] 
      });

    } catch (error) {
      logger.error('Create customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = customerSchemas.update.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const updates = Object.keys(value);
      if (updates.length === 0) {
        res.status(400).json({ error: 'No valid fields to update' });
        return;
      }

      const setClause = updates.map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [id, ...updates.map(key => value[key])];

      const result = await db.query(
        `UPDATE customers SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      logger.info('Customer updated successfully', { customerId: id });
      res.json({ 
        message: 'Customer updated successfully',
        customer: result.rows[0] 
      });

    } catch (error) {
      logger.error('Update customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await db.query(
        'DELETE FROM customers WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      logger.info('Customer deleted successfully', { customerId: id });
      res.json({ message: 'Customer deleted successfully' });

    } catch (error) {
      logger.error('Delete customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const customerController = new CustomerController();