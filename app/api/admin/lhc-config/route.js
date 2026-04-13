import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

function checkAdminCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session');
  return token && token.value === 'ok';
}

export async function GET() {
  if (!checkAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rows } = await pool.query(
    `SELECT classroom, geo_lat, geo_lon, geo_radius_m, ble_threshold 
     FROM lhc_config ORDER BY classroom`
  );

  return NextResponse.json(rows);
}

export async function POST(req) {
  if (!checkAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classroom, geo_lat, geo_lon, geo_radius_m, ble_threshold } =
    await req.json();

  await pool.query(
    `INSERT INTO lhc_config 
     (classroom, geo_lat, geo_lon, geo_radius_m, ble_threshold)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (classroom)
     DO UPDATE SET 
       geo_lat=$2, 
       geo_lon=$3, 
       geo_radius_m=$4,
       ble_threshold=$5,
       updated_at=NOW()`,
    [classroom, geo_lat, geo_lon, geo_radius_m, ble_threshold]
  );

  return NextResponse.json({ ok: true });
}
