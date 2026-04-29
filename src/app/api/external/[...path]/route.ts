import { NextRequest, NextResponse } from 'next/server';

// Disable SSL verification for university API (self-signed certs)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `https://sii.celaya.tecnm.mx/${path}${searchParams ? `?${searchParams}` : ''}`;

  // Token can come from header OR query param
  const authHeader = request.headers.get('Authorization')
    || request.headers.get('x-auth-token')
    || (request.nextUrl.searchParams.get('token') ? `Bearer ${request.nextUrl.searchParams.get('token')}` : '');

  console.log(`[Proxy GET] ${url} | token: ${authHeader ? 'YES' : 'NO'}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(authHeader ? {
          'Authorization': authHeader,
          // Also try without Bearer prefix in case the API expects just the token
          'X-Token': authHeader.replace('Bearer ', ''),
        } : {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    console.log(`[Proxy GET] Status: ${response.status}`);
    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`[Proxy GET] Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `https://sii.celaya.tecnm.mx/${path}`;

  console.log(`[Proxy POST] ${url}`);

  try {
    const body = await request.json().catch(() => ({}));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log(`[Proxy POST] Status: ${response.status}`);
    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`[Proxy POST] Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
