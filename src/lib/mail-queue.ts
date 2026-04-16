import { redis } from './redis';
import { Logger } from './logger';
import { EmailPayload } from '@/types/email';
import { deliverEmail } from './email';

const QUEUE_KEY = 'mail:queue';
const RETRY_DELAY_BASE = 1000; // 1 second
const MAX_RETRIES = 3;

/**
 * 🚀 Push email to the background queue
 * Ensures the main request is not blocked
 */
export async function pushToEmailQueue(payload: EmailPayload) {
  if (!redis) {
    Logger.error('Redis not configured, falling back to direct async delivery');
    // Fallback if Redis is missing (Must await in Serverless)
    try {
      await processEmailJob(payload);
    } catch (err) {
      Logger.error('Fallback email job failed', err);
    }
    return;
  }

  try {
    const id = `${payload.type}:${payload.orderId || Math.random().toString(36).slice(2)}`;
    
    // 🛡️ Idempotency check
    const isDuplicate = await redis.get(`mail:sent:${id}`);
    if (isDuplicate) {
      Logger.info('Duplicate email prevented', { id });
      return;
    }

    await redis.lpush(QUEUE_KEY, JSON.stringify({ ...payload, retryCount: 0, refId: id }));
    Logger.info('Email pushed to queue', { id, type: payload.type });

    // ⚡ Await the trigger to ensure Vercel doesn't kill the process
    await triggerQueueProcessor();
  } catch (error) {
    Logger.error('Failed to push to email queue', error);
  }
}

/**
 * ⚡ Background Trigger
 * In a real-world prod app, this would be a CRON or a QStash call.
 * For this implementation, we'll use a fetch to an internal API route to spawn a separate execution context.
 */
async function triggerQueueProcessor() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    Logger.warn('NEXT_PUBLIC_SITE_URL not set, background trigger might fail in production');
    return;
  }

  try {
    const response = await fetch(`${siteUrl}/api/mail/process`, { 
      method: 'POST', 
      headers: { 'x-action-token': process.env.SUPABASE_SERVICE_ROLE_KEY || '' },
      cache: 'no-store'
    });

    if (!response.ok) {
        const error = await response.text();
        Logger.error('Queue Processor trigger failed', new Error(error));
    }
  } catch (error) {
    Logger.error('Queue Processor network error', error);
  }
}

/**
 * 🏗️ Process a single email job with retry logic
 */
export async function processEmailJob(payload: any) {
  const { retryCount = 0, refId } = payload;
  
  try {
    // Template selection (to be implemented in templates.ts)
    const { renderEmailTemplate } = await import('@/components/emails/EmailTemplates');
    const html = await renderEmailTemplate(payload.type, payload.data);
    
    await deliverEmail(payload, html);

    // Mark as sent for idempotency
    if (redis && refId) {
      await redis.set(`mail:sent:${refId}`, 'true', { ex: 60 * 60 * 24 }); // 24h TTL
    }

  } catch (error: any) {
    Logger.error('Mail Queue Job Failed', error, { payload });

    if (retryCount < MAX_RETRIES) {
      const nextRetry = retryCount + 1;
      const delay = Math.pow(2, nextRetry) * RETRY_DELAY_BASE; // Exponential backoff

      Logger.info(`Scheduling retry ${nextRetry} in ${delay}ms`);
      
      if (redis) {
        setTimeout(async () => {
           await redis!.lpush(QUEUE_KEY, JSON.stringify({ ...payload, retryCount: nextRetry }));
        }, delay);
      }
    } else {
      Logger.error('Max retries reached for email job', { payload });
    }
  }
}
