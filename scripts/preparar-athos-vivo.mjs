// O motor é ÚNICO (lib/athos/athosPatterns.js, verbatim do rizzo-os — regra 2 do
// CLAUDE.md). O pano vivo do cliente importa uma CÓPIA feita aqui a cada build;
// ninguém edita a cópia (ela nem é versionada).
import { copyFileSync, mkdirSync } from "fs";
mkdirSync("public/athos", { recursive: true });
copyFileSync("lib/athos/athosPatterns.js", "public/athos/athosPatterns.js");
console.log("✓ motor Athos copiado pra public/athos/ (pano vivo)");
