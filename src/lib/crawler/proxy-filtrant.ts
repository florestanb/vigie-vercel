import dns from "node:dns/promises";
import http from "node:http";
import net from "node:net";
import { adresseInterdite } from "./reseau";

/**
 * Proxy local par lequel passe tout le trafic du navigateur d'audit. Pour chaque connexion (pages,
 * redirections, ressources, WebSocket), il résout lui-même le nom de domaine, refuse les adresses non
 * publiques, puis se connecte à l'adresse qu'il vient de vérifier : ni une redirection ni un nom qui
 * change de résolution entre-temps (DNS rebinding) ne peuvent atteindre le réseau interne du serveur.
 */

const PORTS_AUTORISES = new Set([80, 443, 8080, 8443]);

async function resoudre(hote: string, port: number): Promise<string | null> {
  if (!PORTS_AUTORISES.has(port) && process.env.VIGIE_AUTORISER_LOCAL !== "1") return null;
  const h = hote.replace(/^\[|\]$/g, "");
  const adresses = net.isIP(h) ? [h] : (await dns.lookup(h, { all: true, verbatim: true }).catch(() => [])).map((a) => a.address);
  if (!adresses.length || adresses.some(adresseInterdite)) return null;
  return adresses[0];
}

function refuser(socket: net.Socket) {
  socket.end("HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n");
}

let demarre: Promise<string> | null = null;

/** Adresse du proxy (démarré une seule fois par processus, sur 127.0.0.1). */
export function proxyFiltrant(): Promise<string> {
  demarre ??= new Promise((ok, ko) => {
    const serveur = http.createServer(async (req, res) => {
      // HTTP en clair : l'adresse complète arrive dans la ligne de requête.
      let cible: URL;
      try {
        cible = new URL(req.url ?? "");
      } catch {
        res.writeHead(400).end();
        return;
      }
      const port = Number(cible.port) || 80;
      const ip = cible.protocol === "http:" ? await resoudre(cible.hostname, port) : null;
      if (!ip) {
        res.writeHead(403).end();
        return;
      }
      // En-têtes propres à la connexion avec le navigateur : ils ne se transmettent pas (RFC 9110, 7.6.1).
      const entetes = { ...req.headers };
      for (const h of ["proxy-connection", "proxy-authorization", "connection", "keep-alive", "upgrade", "te", "trailer", "transfer-encoding"]) delete entetes[h];
      entetes.connection = "close";
      const amont = http.request({ host: ip, port, method: req.method, path: cible.pathname + cible.search, headers: entetes, setHost: false, agent: false }, (r) => {
        res.writeHead(r.statusCode ?? 502, r.headers);
        r.pipe(res);
      });
      amont.on("socket", (s) => s.unref());
      amont.on("error", () => res.headersSent ? res.destroy() : res.writeHead(502).end());
      req.pipe(amont);
    });

    // HTTPS et WebSocket sécurisé : tunnel CONNECT vers l'adresse vérifiée.
    serveur.on("connect", async (req, client: net.Socket, tete: Buffer) => {
      client.on("error", () => client.destroy());
      const m = (req.url ?? "").match(/^\[?([^\]]+?)\]?:(\d+)$/);
      const ip = m ? await resoudre(m[1], Number(m[2])) : null;
      if (!m || !ip) return refuser(client);
      const amont = net.connect(Number(m[2]), ip, () => {
        amont.unref();
        client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        if (tete.length) amont.write(tete);
        amont.pipe(client);
        client.pipe(amont);
      });
      amont.on("error", () => client.destroy());
      client.on("close", () => amont.destroy());
    });

    serveur.on("clientError", (_e, socket) => socket.destroy());
    // Le proxy ne maintient jamais le processus en vie à lui seul (scripts, tests).
    serveur.on("connection", (socket) => socket.unref());
    serveur.listen(0, "127.0.0.1", () => {
      serveur.unref();
      ok(`http://127.0.0.1:${(serveur.address() as net.AddressInfo).port}`);
    });
    serveur.on("error", ko);
  });
  return demarre;
}
