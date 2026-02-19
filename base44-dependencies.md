# Levantamento de Dependências - Base44

Este documento lista todos os vínculos, pacotes e arquivos que dependem da plataforma **Base44**. Esta lista serve como guia para a migração ou remoção total do vínculo sem perda de dados ou funcionalidades críticas.

## 1. Pacotes NPM (package.json)
Estes são os pacotes fornecidos pela Base44 que precisam ser substituídos ou removidos:
- `@base44/sdk`: SDK principal para comunicação com o backend e autenticação.
- `@base44/vite-plugin`: Plugin do Vite usado para gerenciar visualização e injeções de script da plataforma.

## 2. Configurações de Ambiente (.env.local)
Variáveis que conectam o app ao projeto específico na plataforma:
- `VITE_BASE44_APP_ID`: ID único da aplicação.
- `VITE_BASE44_APP_BASE_URL`: URL base da API do projeto.
- `BASE44_LEGACY_SDK_IMPORTS`: Flag de compatibilidade para código antigo.

## 3. Arquivos de Configuração do Projeto
- `vite.config.js`: Importa e utiliza o `base44({ ... })` nas configurações de plugins.
- `index.html`: Referência ao logo da Base44 (`https://base44.com/logo_v2.svg`) e link para o `manifest.json`.
- `public/manifest.json`: Configurações de metadados PWA vinculados ao nome da marca.

## 4. Núcleo da API e Autenticação (src/)
Estes arquivos são o "coração" do vínculo e precisarão de refatoração completa:
- `src/api/base44Client.js`: Onde o cliente SDK é instanciado.
- `src/lib/AuthContext.jsx`: Gerencia o login, logout e sessão através da Base44.
- `src/lib/app-params.js`: Captura parâmetros da URL (como tokens) passados pela plataforma.
- `src/lib/NavigationTracker.jsx`: Monitora a navegação para ferramentas de análise da plataforma.
- `src/App.jsx`: Utiliza o `AuthProvider` e lida com erros de autenticação da plataforma.

## 5. Entidades de Dados (Modelos de Dados)
A aplicação consome as seguintes coleções de dados (Tabelas) da Base44. Se o vínculo for removido, esses dados precisarão ser migrados para outro banco de dados:
- **Destination**: Usada em `Home.jsx`, `Destinations.jsx` e `DestinationDetail.jsx`.
- **Guide**: Usada em `Guides.jsx`.
- **Testimonial**: Usada para depoimentos (provavelmente em `Testimonial.jsx`).
- **ContactRequest**: Usada para capturar mensagens do formulário de contato (`ContactSection.jsx`).

## 6. Páginas e Componentes com Chamadas Ativas
Locais onde o código faz consultas diretas ao banco de dados Base44:
- `src/pages/Home.jsx`: Chamada para `base44.entities.Destination.list`.
- `src/pages/Guides.jsx`: Chamada para `base44.entities.Guide.list`.
- `src/pages/Destinations.jsx`: Listagem e busca de destinos.
- `src/pages/DestinationDetail.jsx`: Busca de um destino específico por ID.
- `src/components/home/ContactSection.jsx`: Envio de dados para a entidade `ContactRequest`.
- `src/components/common/Navbar.jsx` & `Footer.jsx`: Podem conter links ou lógicas de usuário baseadas no `useAuth`.

---
**Observação:** Antes de remover, recomenda-se exportar os dados brutos (JSON/CSV) de cada Entidade listada no item 5 através do painel da Base44.
