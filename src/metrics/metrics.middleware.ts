import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private httpRequestsTotal: Counter<string>;
  private httpRequestDurationSeconds: Histogram<string>;

  constructor() {
    // Collect default system metrics (CPU, Memory, etc.)
    collectDefaultMetrics();

    // Track total number of HTTP requests (Traffic)
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests received',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Track request latency (Latency)
    this.httpRequestDurationSeconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.3, 1.5, 5, 10], // Buckets for response time
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const route = req.route?.path || req.path;
    const end = this.httpRequestDurationSeconds.startTimer({
      method: req.method,
      route: route,
    });

    res.on('finish', () => {
      this.httpRequestsTotal.inc({
        method: req.method,
        route: route,
        status_code: res.statusCode.toString(),
      });
      end({ status_code: res.statusCode.toString() });
    });

    next();
  }
}
