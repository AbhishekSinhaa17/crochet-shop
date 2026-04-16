import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { processEmailJob } from '@/lib/mail-queue';
import { Logger } from '@/lib/logger';

const QUEUE_KEY = 'mail:queue';

/**
 * ⚡ Mail Queue Processor Route
 * Triggered by the application to process pending emails asynchronously.
 * Protects via Service Role Key for security.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-action-token');
  
  if (authHeader !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json({ error: 'Redis Disconnected' }, { status: 500 });
  }

  try {
    // Process up to 5 messages per trigger to keep within serverless timeouts
    const jobs = [];
    for (let i = 0; i < 5; i++) {
        const jobData = await redis.rpop(QUEUE_KEY);
        if (!jobData) break;
        
        const payload = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;
        jobs.push(processEmailJob(payload));
    }

    if (jobs.length > 0) {
        await Promise.allSettled(jobs);
        Logger.info(`Processed ${jobs.length} email jobs`);
    }

    return NextResponse.json({ success: true, processed: jobs.length });
  } catch (error: any) {
    Logger.error('Mail Processor Route Fatal Error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
