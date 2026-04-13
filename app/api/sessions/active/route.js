import { query } from "../../../../lib/db";

export async function GET() {
  // 1. Get active session
  const active = await query(
    "SELECT * FROM sessions WHERE closed_at IS NULL ORDER BY opened_at DESC LIMIT 1",
    []
  );

  const session = active.rows[0];

  if (!session) {
    return new Response(
      JSON.stringify({ session: null }),
      { headers: { "content-type": "application/json" } }
    );
  }

  // 2. Get classroom config (THIS IS THE IMPORTANT PART)
  const config = await query(
    "SELECT * FROM lhc_config WHERE classroom = $1",
    [session.classroom]
  );

  const cfg = config.rows[0];

  // 3. Return EVERYTHING needed
  return new Response(
    JSON.stringify({
      session,
      classroom: session.classroom,
      lat: cfg.geo_lat,
      lon: cfg.geo_lon,
      radius: cfg.geo_radius_m,
      bleThreshold: cfg.ble_threshold
    }),
    { headers: { "content-type": "application/json" } }
  );
}
