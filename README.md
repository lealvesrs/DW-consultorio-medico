# 🚀 Desenvolvimento Web 3 (DW3) - IFSP Votuporanga

Este repositório contém o projeto de aplicação web Full-Stack desenvolvido para a disciplina de *Desenvolvimento Web 3* do Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) - Câmpus Votuporanga.

O projeto é composto por duas partes principais: *Backend (API)* e *Frontend (Interface)*.

---

## 💻 Tecnologias Utilizadas

### Backend (API)
* *Node.js:* Ambiente de execução.
* *Express:* Framework web para Node.js.
* *JWT (JSON Web Token):* Para autenticação e segurança das rotas.
* *Estrutura MVC:* Organização com Rotas, Controllers e Models.
* *Porta de Execução:* 40000

### Frontend (Interface)
* *Node.js:* Utilizado para servir os arquivos e gerenciar o projeto.
* *Nunjucks:* Motor de template para renderização das views (HTML).
* *HTML, CSS:* Estrutura e estilização da interface.
* *Porta de Execução:* 30000

---

## 🛠 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### 1. Configuração do Backend

O backend é a API responsável por gerenciar os dados e a autenticação.

1.  *Acesse a pasta do backend:*
    bash
    cd backend
    

2.  *Instale as dependências:*
    bash
    npm install
    

3.  *Configuração do Banco de Dados:*
    * Renomeie ou crie um arquivo de ambiente (.env) baseado no seu template.
    * *Altere as variáveis de ambiente* no arquivo .env para se conectar ao seu banco de dados (ex: DB_HOST, DB_USER, DB_PASS, DB_NAME).

4.  *Criação das Tabelas:*
    * Execute o script SQL que está dentro da pasta database/ no seu sistema de gerenciamento de banco de dados para criar as tabelas necessárias.

5.  *Inicialize o servidor backend:*
    bash
    node app.js
    
    * O servidor estará rodando em http://localhost:40000.

### 2. Configuração do Frontend

O frontend é a interface web que consome a API do backend.

1.  *Acesse a pasta do frontend:*
    ````bash
    cd ../frontend
    ````
    

2.  *Instale as dependências:*
    ````bash
    npm install
    ````
    

3.  *Inicialize o servidor frontend:*
    ````bash
    node srvDW3Front.js
    ````
    
    * O frontend estará acessível em http://localhost:30000.

---

## 🔑 Autenticação

A comunicação entre o frontend e as rotas protegidas do backend é feita através de *JSON Web Tokens (JWT)*, garantindo a segurança e o acesso restrito a funcionalidades específicas da aplicação.