import { getStore } from "@netlify/blobs";

const APPROVER = "murilo";
const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
const nice = (s) => s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());

function mutate(d, b) {
  const u = norm(b.user);
  if (!u) return "Nome obrigatório";
  d.approvals ||= {}; d.users ||= {}; d.log ||= [];
  d.edits ||= {};
  if ((b.type === "resetAll" || b.type === "resetPost") && u !== APPROVER) return "Só o Murilo pode redefinir";
  if (b.type === "resetAll") {
    d.approvals = {}; d.edits = {}; d.log = [];
  } else if (b.type === "resetPost") {
    delete d.approvals[String(b.id)]; delete d.edits[String(b.id)];
  } else if (b.type === "edit") {
    if (u !== APPROVER) return "Só o Murilo pode editar";
    const id = String(b.id);
    if (b.reset) delete d.edits[id];
    else d.edits[id] = {
      text: String(b.text || "").trim().slice(0, 5000),
      tags: (b.tags || []).map(String).slice(0, 30),
      by: nice(u), at: new Date().toISOString(),
    };
  } else if (b.type === "vote") {
    if (u !== APPROVER) return "Só o Murilo pode aprovar";
    const by = nice(u), at = new Date().toISOString(), id = String(b.id);
    if (!b.vote) delete d.approvals[id];
    else d.approvals[id] = { vote: b.vote === "down" ? "down" : "up", by, at };
    d.log.unshift({ id, vote: b.vote || null, by, at });
    d.log = d.log.slice(0, 200);
  } else if (b.type === "prefs") {
    d.users[u] = {
      liked: (b.liked || []).map(String).slice(0, 200),
      saved: (b.saved || []).map(String).slice(0, 200),
    };
  } else return "Ação inválida";
}

export default async (req) => {
  const store = getStore({ name: "portal-aprovacoes", consistency: "strong" });
  const d = (await store.get("db", { type: "json" })) || { approvals: {}, users: {}, log: [] };
  if (req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }
    const err = mutate(d, b);
    if (err) return Response.json({ error: err }, { status: 403 });
    await store.setJSON("db", d);
  }
  return Response.json(d, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/state" };
