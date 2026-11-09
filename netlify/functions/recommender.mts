import type { Config, Context } from '@netlify/functions';
import serverless from 'serverless-http';
import { app } from '../../api.js';

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const handle = serverless(app);
  const result = await handle({
    version: '2.0',
    rawPath: url.pathname,
    rawQueryString: url.search.slice(1),
    headers: Object.fromEntries(request.headers),
    requestContext: {
      http: { method: request.method, sourceIp: context.ip },
    },
    body: request.method === 'GET' || request.method === 'HEAD'
      ? undefined : await request.text(),
    isBase64Encoded: false,
  }, {}) as {
    statusCode: number;
    headers: Record<string, string>;
    cookies?: string[];
    body: string;
    isBase64Encoded?: boolean;
  };

  const headers = new Headers(result.headers as Record<string, string>);
  for (const cookie of result.cookies || []) headers.append('Set-Cookie', cookie);
  return new Response(
    result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body,
    { status: result.statusCode, headers },
  );
}

export const config: Config = { path: ['/chat', '/health'] };
