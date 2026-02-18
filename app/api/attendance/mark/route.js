import { query } from "../../../../lib/db";
import { distanceMeters } from "../../../../lib/geo";

const headers = { 'content-type': 'text/plain; charset=utf-8' };

export async function POST(req) {
  const body = await req.json();
  const { regNo, deviceMac, lat, lon, classroom } = body || {};

  if (!regNo || !deviceMac || typeof lat !== 'number' || typeof lon !== 'number' || !classroom) {
    return new Response('ERROR: regNo, deviceMac, lat, lon, classroom required', { status: 400, headers });
  }

  const act = await query('select * from sessions where closed_at is null and classroom = $1 limit 1', [classroom]);
  if (!act.rows.length) return new Response('ERROR: No active session for this classroom', { status: 409, headers });
  const session = act.rows[0];

  const ures = await query('select * from users where reg_no = $1', [regNo]);
  if (!ures.rows.length) return new Response('ERROR: User not found. Register first.', { status: 404, headers });
  const user = ures.rows[0];

  if (user.device_mac !== deviceMac) return new Response('ERROR: Device mismatch for this user', { status: 403, headers });

  const lhcRes = await query('select * from lhc_config where classroom = $1', [classroom]);
  if (!lhcRes.rows.length) return new Response('ERROR: Classroom configuration not found', { status: 404, headers });
  const lhc = lhcRes.rows[0];

  const geoLat = parseFloat(lhc.geo_lat);
  const geoLon = parseFloat(lhc.geo_lon);
  const radius = parseFloat(lhc.geo_radius_m || '200');

  const d = distanceMeters(geoLat, geoLon, lat, lon);
  if (d > radius) return new Response(`ERROR: Outside allowed location radius (${d.toFixed(2)}m from center)`, { status: 403, headers });

  try {
    const ins = await query(
      'insert into attendance(session_id, user_id, lat, lon, device_mac) values($1,$2,$3,$4,$5) returning *',
      [session.id, user.id, lat, lon, deviceMac]
    );
    return new Response(`SUCCESS: Attendance marked at ${new Date(ins.rows[0].created_at).toLocaleTimeString()}`, { status: 200, headers });
  } catch (e) {
    return new Response('ERROR: Already marked or Device already used in this session', { status: 409, headers });
  }
}
