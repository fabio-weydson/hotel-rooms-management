# Hotel Clean Management - SPA

Sistema de vistoria de quartos para pousadas desenvolvido com React, Vite, Tailwind CSS e Shadcn/UI.

![hotel-rooms-management preview](https://raw.githubusercontent.com/fabio-weydson/hotel-rooms-management/refs/heads/main/preview.png?raw=true)


## Funcionalidades

- **Lista de Quartos**: Visualizar todos os quartos com status de limpeza
- **Vistoria Interativa**: Interface estilo Tinder para avaliar itens de limpeza
- **Resumo de Vistoria**: Visualizar resultados das vistorias realizadas
- **Responsivo**: Interface adaptada para dispositivos móveis
- **Supabase**: Integração com banco de dados PostgreSQL

## Tecnologias

- **React 18**: Framework JavaScript
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utility-first
- **Shadcn/UI**: Componentes UI acessíveis
- **Lucide React**: Ícones
- **Supabase**: Backend como serviço

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Execute o banco de dados com o script `database.sql`

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas:

- **quartos**: Informações dos quartos
- **vistorias**: Registros de vistorias realizadas
- **itens**: Itens a serem verificados na limpeza
- **vistoria_itens**: Relacionamento entre vistorias e itens avaliados
- **usuarios**: Responsáveis pelas vistorias
- **usuario_tipo**: Tipos de usuários

## Como Usar

1. **Página Inicial**: Lista todos os quartos ordenados por status de limpeza
2. **Seleção de Quarto**: Clique em um quarto para ver detalhes ou iniciar vistoria
3. **Vistoria**: 
   - Avalie cada item como "OK" ou "Não OK"
   - Para itens "Não OK", adicione comentários e fotos
   - Navegue entre itens usando os botões
   - Finalize com avaliação geral do quarto
4. **Resumo**: Visualize o resultado da vistoria com status de cada item

## Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run preview`: Visualiza build de produção localmente

## Interface Mobile-First

O sistema foi desenvolvido com foco em dispositivos móveis, sendo totalmente responsivo e otimizado para tablets e smartphones.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
