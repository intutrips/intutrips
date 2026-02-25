# TODO LIST: Etapa Final

## Tarefas Pendentes

- [x] **1. Colocar no rodapé o link direto para cada página de destinos no nome de cada país**
  - **Ação:** Entrar no arquivo `src/components/common/Footer.jsx`.
  - **Execução:** Ao invés de uma lista de texto estática (`<li>Índia</li>`), vamos injetar o componente `<Link>` do React apontando para as novas rotas limpas (ex: `to="/indonesia"`, `to="/china"`) para que as pessoas possam navegar para os roteiros a partir de qualquer lugar do site.

- [x] **2. O botão de Instagram no Rodapé precisa direcionar para o perfil correto**
  - **Ação:** Modificar botão das redes sociais no `src/components/common/Footer.jsx`.
  - **Execução:** Trocar o `href="#"` pelo link oficial `https://www.instagram.com/intu.trips/` configurado para abrir numa nova aba com segurança (`target="_blank" rel="noopener noreferrer"`).

- [x] **3. Deixar os textos da Home dinâmicos e editáveis no backoffice**
  - **Ação:** Banco de Dados + Telas de Admin + Frontend (`Home.jsx` e componentes).
  - **Execução:** 
    1. Criar uma tabela de `home_settings` no Supabase (ou usar uma de configurações globais).
    2. Criar uma interface no Painel Admin (ex: *Configurações da Home*) para permitir a edição de títulos, subtítulos, etc.
    3. Integrar os componentes da Página Inicial para buscarem e exibirem essas informações dinamicamente a partir do banco de dados.

- [x] **4. Deixar os textos da página "Quem Somos" dinâmicos e editáveis no backoffice**
  - **Ação:** Banco de Dados + Telas de Admin + Frontend (`About.jsx`).
  - **Execução:**
    1. Criar colunas ou uma tabela para armazenar os parágrafos de história e missão da empresa.
    2. Adicionar formulários de edição de texto rico/longo no Backoffice.
    3. Conectar a página "Sobre Nós" para buscar essa informação durante o carregamento.

- [x] **5. Aba de NOSSA HISTÓRIA: Selo de +5 anos de experiência (TIRAR). Trocar a foto deste destaque**
  - **Ação:** Modificar marcações visuais na página sobre a empresa (`src/pages/About.jsx`).
  - **Execução:**
    1. Localizar o código do bloco "Nossa História".
    2. Remover o elemento visual (selo/badge) com o texto "+5 anos de experiência".
    3. Permitir a alteração dinâmica ou substituir hardcoded a URL da imagem de destaque atual.
