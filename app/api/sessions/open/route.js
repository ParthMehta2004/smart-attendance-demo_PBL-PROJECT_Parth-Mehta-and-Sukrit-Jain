import { query } from "../../../../lib/db";

export async function POST(req) {
  try {
    // 🔐 Optional admin key check (safe fallback)
    const adminKey = req.headers.get("x-admin-key");
    if (process.env.ADMIN_KEY && adminKey !== process.env.ADMIN_KEY) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    // 📦 Parse body safely
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    const classroom = String(body.classroom || "LHC 001");

    // 🧹 Close any existing active session
    await query(
      "UPDATE sessions SET closed_at = NOW() WHERE closed_at IS NULL",
      []
    );

    // 🆕 Create new session
    const ins = await query(
      "INSERT INTO sessions(classroom, opened_at) VALUES($1, NOW()) RETURNING *",
      [classroom]
    );

    return new Response(
      JSON.stringify({
        message: "Session opened",
        session: ins.rows[0]
      }),
      { headers: { "content-type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

// ✅ ALSO allow GET for testing in browser
export async function GET() {
  try {
    await query(
      "UPDATE sessions SET closed_at = NOW() WHERE closed_at IS NULL",
      []
    );

    const ins = await query(
      "INSERT INTO sessions(classroom, opened_at) VALUES($1, NOW()) RETURNING *",
      ["LHC 001"]
    );

    return new Response(
      JSON.stringify({
        message: "Session opened (GET)",
        session: ins.rows[0]
      }),
      { headers: { "content-type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
