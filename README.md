# NetGuardian

Sistema de monitoramento de rede.

## Estrutura do Projeto

-   **WEB**: Frontend (React + Vite)
-   **SERVER**: Backend (Node.js + Express + MySQL)
-   **DATABASE**: Scripts de banco de dados

## Pré-requisitos

-   Node.js instalado
-   MySQL instalado e rodando

## Configuração Inicial

1.  **Banco de Dados**:
    -   Execute o script `DATABASE/database.sql` no seu cliente MySQL para criar o banco e as tabelas.
    -   Verifique se as credenciais no arquivo `SERVER/.env` estão corretas (padrão: user `root`, password `root`).

2.  **Instalação**:
    -   Na raiz do projeto, execute:
        ```bash
        npm run install:all
        ```
        Isso instalará as dependências da raiz, do backend e do frontend.

## Como Rodar

Para iniciar a aplicação (Frontend e Backend simultaneamente):

```bash
npm start
```

-   **Frontend**: http://localhost:5173
-   **Backend**: http://localhost:3300

## Funcionalidades

-   Dashboard com status em tempo real.
-   Inventário de dispositivos (CRUD completo).
-   Logs de atividade recente.
