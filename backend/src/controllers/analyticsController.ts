import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { logger } from '../utils/logger';

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      // Try to get cached metrics first
      let metrics = await analyticsService.getCachedMetrics();
      
      if (!metrics) {
        // Calculate fresh metrics if cache miss
        metrics = await analyticsService.calculateMetrics();
      }

      res.json({ analytics: metrics });

    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to retrieve analytics data' });
    }
  }

  async refreshAnalytics(req: Request, res: Response): Promise<void> {
    try {
      // Force recalculation of metrics
      const metrics = await analyticsService.calculateMetrics();
      
      res.json({ 
        message: 'Analytics refreshed successfully',
        analytics: metrics 
      });

    } catch (error) {
      logger.error('Refresh analytics error:', error);
      res.status(500).json({ error: 'Failed to refresh analytics data' });
    }
  }

  async getRevenueReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      
      // Validate date parameters
      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Start date and end date are required' });
        return;
      }

      // This would generate a detailed revenue report
      // For now, we'll return a simplified version
      const metrics = await analyticsService.calculateMetrics();
      
      res.json({
        report: {
          period: { startDate, endDate },
          totalRevenue: metrics.totalRevenue,
          monthlyBreakdown: metrics.monthlyRevenue,
          averageBookingValue: metrics.totalRevenue / Math.max(metrics.pendingBookings + 10, 1), // Rough estimate
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Get revenue report error:', error);
      res.status(500).json({ error: 'Failed to generate revenue report' });
    }
  }

  async getOccupancyReport(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.calculateMetrics();
      
      res.json({
        report: {
          currentOccupancyRate: metrics.occupancyRate,
          averageOccupancy: metrics.avgOccupancy,
          monthlyTrend: metrics.occupancyTrend,
          activeGuests: metrics.activeGuests,
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Get occupancy report error:', error);
      res.status(500).json({ error: 'Failed to generate occupancy report' });
    }
  }
}

export const analyticsController = new AnalyticsController();