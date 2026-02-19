# MIGRATION TODO LIST: Base44 -> Supabase

Este documento gerencia o progresso da remoção total do vínculo com a plataforma Base44 e a transição para o Supabase.

## 🔑 Credenciais de Teste (Supabase)
- **Usuário:** wfss1982@gmail.com
- **Senha:** 000000

---

## 1. Preparação da Infraestrutura [CONCLUÍDO]
- [x] Criar tabelas no Supabase (`destinations`, `guides`, `testimonials`, `contact_requests`).
- [x] Configurar permissões de leitura pública (RLS).
- [x] Instalar `@supabase/supabase-js`.
- [x] Configurar variáveis de ambiente no `.env.local`.
- [x] Criar cliente Supabase em `src/lib/supabase.js`.

## 2. Migração de Dados (Conteúdo) [CONCLUÍDO]
- [x] Exportar dados da Base44 (Destinos, Guias, Depoimentos).
- [x] Importar dados nas tabelas do Supabase.
- [x] Baixar imagens hospedadas na Base44 e subir no Supabase Storage (Imagens migradas via URLs direto).

## 3. Refatoração de Código (Leitura de Dados) [CONCLUÍDO]
- [x] **Home.jsx**: Trocar `base44.entities.Destination.list` por `supabase.from('destinations').select()`.
- [x] **Guides.jsx**: Trocar calls do SDK pelo cliente Supabase.
- [x] **Destinations.jsx**: Atualizar lógica de listagem e filtros.
- [x] **DestinationDetail.jsx**: Atualizar busca de item único.
- [x] **ContactSection.jsx**: Alterar `base44.entities.ContactRequest.create` para `supabase.from('contact_requests').insert()`.

## 4. Autenticação e Sessão [CONCLUÍDO]
- [x] Substituir `AuthContext.jsx` para usar `supabase.auth`.
- [x] Criar página de Login (`src/pages/Login.jsx`).
- [x] Configurar login/logout no Supabase.
- [x] Criar o usuário `wfss1982@gmail.com` no Dashboard do Supabase Auth.

## 5. Limpando o Projeto (Desvinculação Total) [CONCLUÍDO]
- [x] Remover `src/api/base44Client.js`.
- [x] Remover `src/lib/app-params.js`.
- [x] Remover `src/lib/NavigationTracker.jsx`.
- [x] Limpar `vite.config.js` (remover plugin `@base44/vite-plugin`).
- [x] Desinstalar pacotes `@base44/*` via npm.
- [x] Limpar `index.html` e deletar `public/manifest.json`.

---
*Data de Início: 19/02/2026*
*Status Atual: Migração concluída com sucesso. O projeto está 100% desvinculado da Base44 e operando com Supabase.*
