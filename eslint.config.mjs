import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Código de terceiro versionado de propósito: os projetos HyperFrames dos
    // filmes da /rizzoos carregam o GSAP como ARQUIVO LOCAL, porque render
    // determinístico não pode buscar nada na rede. Não é código nosso, não sai
    // no bundle do site (nada em app/ importa isso) e é minificado — o lint só
    // teria a dizer que a GreenSock usa `var self = this`.
    "hyperframes/**/assets/**",
  ]),
]);

export default eslintConfig;
