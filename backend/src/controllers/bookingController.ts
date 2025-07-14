import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { logger } from '../utils/logger';
import { bookingSchemas } from '../utils/validation';

export class BookingController {
  async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, status, customer_id, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = 'SELECT * FROM bookings WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (status) {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        params.push(status);
      }

      if (customer_id) {
        paramCount++;
        query += ` AND customer_id = $${paramCount}`;
        params.push(customer_id);
      }

      if (search) {
        paramCount++;
        query += ` AND (customer_name ILIKE $${paramCount} OR room_number ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(Number(limit), offset);

      const result = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM bookings WHERE 1=1';
      const countParams: any[] = [];
      let countParamCount = 0;

      if (status) {
        countParamCount++;
        countQuery += ` AND status = $${countParamCount}`;
        countParams.push(status);
      }

      if (customer_id) {
        countParamCount++;
        countQuery += ` AND customer_id = $${countParamCount}`;
        countParams.push(customer_id);
      }

      if (search) {
        countParamCount++;
        countQuery += ` AND (customer_name ILIKE $${countParamCount} OR room_number ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`);
      }

      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        bookings: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      logger.error('Get bookings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM bookings WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      res.json({ booking: result.rows[0] });

    } catch (error) {
      logger.error('Get booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = bookingSchemas.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const bookingId = uuidv4();
      const { customer_id, customer_name, room_number, check_in, check_out, amount, status } = value;

      // Verify customer exists
      const customerResult = await db.query(
        'SELECT id FROM customers WHERE id = $1',
        [customer_id]
      );

      if (customerResult.rows.length === 0) {
        res.status(400).json({ error: 'Customer not found' });
        return;
      }

      const result = await db.query(
        `INSERT INTO bookings (id, customer_id, customer_name, room_number, check_in, check_out, amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [bookingId, customer_id, customer_name, room_number, check_in, check_out, amount, status]
      );

      // Update customer's total spent
      await db.query(
        'UPDATE customers SET total_spent = total_spent + $1 WHERE id = $2',
        [amount, customer_id]
      );

      logger.info('Booking created successfully', { bookingId, customer_id });
      res.status(201).json({ 
        message: 'Booking created successfully',
        booking: result.rows[0] 
      });

    } catch (error) {
      logger.error('Create booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = bookingSchemas.update.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const updates = Object.keys(value);
      if (updates.length === 0) {
        res.status(400).json({ error: 'No valid fields to update' });
        return;
      }

      // Get current booking for amount comparison
      const currentBooking = await db.query(
        'SELECT customer_id, amount FROM bookings WHERE id = $1',
        [id]
      );

      if (currentBooking.rows.length === 0) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      const setClause = updates.map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [id, ...updates.map(key => value[key])];

      const result = await db.query(
        `UPDATE bookings SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      );

      // Update customer's total spent if amount changed
      if (value.amount !== undefined) {
        const oldAmount = currentBooking.rows[0].amount;
        const newAmount = value.amount;
        const difference = newAmount - oldAmount;

        await db.query(
          'UPDATE customers SET total_spent = total_spent + $1 WHERE id = $2',
          [difference, currentBooking.rows[0].customer_id]
        );
      }

      logger.info('Booking updated successfully', { bookingId: id });
      res.json({ 
        message: 'Booking updated successfully',
        booking: result.rows[0] 
      });

    } catch (error) {
      logger.error('Update booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get booking details before deletion
      const bookingResult = await db.query(
        'SELECT customer_id, amount FROM bookings WHERE id = $1',
        [id]
      );

      if (bookingResult.rows.length === 0) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      const { customer_id, amount } = bookingResult.rows[0];

      // Delete booking
      await db.query('DELETE FROM bookings WHERE id = $1', [id]);

      // Update customer's total spent
      await db.query(
        'UPDATE customers SET total_spent = GREATEST(total_spent - $1, 0) WHERE id = $2',
        [amount, customer_id]
      );

      logger.info('Booking deleted successfully', { bookingId: id });
      res.json({ message: 'Booking deleted successfully' });

    } catch (error) {
      logger.error('Delete booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const bookingController = new BookingController();