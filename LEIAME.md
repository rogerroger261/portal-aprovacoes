# Portal de Aprovações · Inter Telecom — pronto para o Netlify

Esta pasta já está no formato que o Netlify espera. Não renomeie nem mova arquivos.

```
index.html                    ← o portal
img/001.jpg … img/010.jpg     ← as artes
netlify/functions/state.mjs   ← salva aprovações e edições (Netlify Blobs)
netlify.toml                  ← configuração do Netlify
package.json                  ← dependência @netlify/blobs
```

## Publicar (com aprovações compartilhadas)

**Pelo GitHub (sem instalar nada):**
1. github.com → New repository → "uploading an existing file" → arraste o CONTEÚDO desta pasta → Commit.
2. app.netlify.com → Add new site → Import an existing project → GitHub → escolha o repositório.
3. Deixe tudo como está (o netlify.toml já configura) → Deploy.

**Pelo terminal (precisa do Node.js):**
```
npm install
npx netlify-cli deploy --prod
```

## Não use o Netlify Drop
Arrastar a pasta no Drop publica a página, mas NÃO ativa a função que salva — cada pessoa veria só o que fez no próprio navegador.

## Teste depois de publicar
Entre como Murilo em um aparelho, aprove uma publicação; entre como Roger em outro aparelho e confira (atualiza a cada 10 s).
