# suplacard-landing-meta-forms

Landing page de Suplacard con cotizador interactivo exportada desde Base44 para Meta Ads.

## Setup local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy en Railway

Este repositorio incluye configuración base para Railway + Vite:

- `railway.toml` con `startCommand`
- Script `npm run start` para levantar `vite preview` usando `PORT`
- Estructura requerida por Base44 con módulos `src/` y `base44/`

```bash
npm run build
npm run start
```
