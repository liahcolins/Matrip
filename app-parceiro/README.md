# 🧭 Matrip — Aplicativo Administrativo

Aplicativo administrativo da **Matrip**, uma startup maranhense de tecnologia aplicada ao turismo.

O **app-admMatrip** é uma ferramenta interna destinada à gestão completa do ecossistema Matrip, permitindo o gerenciamento de parceiros, produtos, vendas, pagamentos, avaliações e informações turísticas disponibilizadas aos usuários da plataforma.

---

## 📌 Sobre a Matrip

A Matrip tem como objetivo centralizar informações turísticas e facilitar o acesso dos turistas aos melhores passeios, agências, guias e localidades do Maranhão.

A plataforma conecta:

* Turistas;
* Agências de turismo;
* Guias credenciados;
* Parceiros comerciais;
* Administradores da plataforma.

Além disso, a Matrip busca oferecer experiências personalizadas de acordo com o perfil de cada turista, incentivando o turismo local e fortalecendo os profissionais e empresas do setor.

---

## 🖥️ Sobre o app-admMatrip

O **app-admMatrip** é o aplicativo utilizado pelos administradores da Matrip para controlar e acompanhar as principais operações da plataforma.

Por meio do sistema, os administradores podem cadastrar parceiros e produtos, acompanhar vendas, controlar pagamentos, analisar avaliações e gerenciar as informações apresentadas aos turistas.

---

## ✨ Funcionalidades

### 👥 Gerenciamento de parceiros

* Cadastro de agências de turismo;
* Cadastro de guias credenciados;
* Consulta de parceiros cadastrados;
* Atualização dos dados dos parceiros;
* Bloqueio e desbloqueio de parceiros.

### 🧳 Gerenciamento de produtos

* Cadastro de passeios;
* Cadastro de experiências turísticas;
* Cadastro de experiências gastronômicas e culturais;
* Edição dos dados dos produtos;
* Consulta de produtos cadastrados;
* Bloqueio e desbloqueio de produtos.

### 💳 Gerenciamento de vendas

* Consulta das vendas realizadas;
* Visualização dos detalhes das vendas;
* Cancelamento de vendas;
* Acompanhamento do status das compras;
* Controle de contas a receber.

### 💰 Gerenciamento financeiro

* Controle dos valores recebidos pelas vendas;
* Controle de contas a receber;
* Controle de contas a pagar;
* Gerenciamento dos pagamentos destinados aos parceiros;
* Consulta do histórico de pagamentos.

### ⭐ Gerenciamento de avaliações

* Consulta das avaliações realizadas pelos turistas;
* Moderação de comentários;
* Bloqueio ou remoção de avaliações inadequadas;
* Acompanhamento das notas de produtos e parceiros.

### 📍 Gerenciamento de localidades

* Cadastro de localidades turísticas;
* Edição das descrições dos destinos;
* Gerenciamento das histórias das localidades;
* Disponibilização de informações culturais e históricas;
* Organização do conteúdo apresentado aos turistas.

Essa funcionalidade está relacionada ao propósito da Matrip de apresentar ao turista a história do estado do Maranhão e valorizar sua cultura, seus destinos e suas tradições.

---

## 🏗️ Arquitetura do sistema

O sistema está dividido em três partes principais:

```text
Aplicativo Administrativo
        ↓
API REST — Spring Boot
        ↓
Banco de Dados — MySQL
```

### Front-end

Responsável pela interface utilizada pelos administradores para acessar as funcionalidades do sistema.

### Back-end

Responsável pelas regras de negócio, autenticação, validação dos dados e comunicação entre o aplicativo e o banco de dados.

### Banco de dados

Responsável pelo armazenamento das informações relacionadas aos administradores, parceiros, produtos, vendas, pagamentos, avaliações e localidades.

---

## 🛠️ Tecnologias utilizadas

### Front-end

* React Native;
* JavaScript;
* HTML;
* CSS.

### Back-end

* Java;
* Spring Boot;
* Spring Web;
* Spring Data JPA;
* API REST.

### Banco de dados

* MySQL.

### Versionamento

* Git;
* GitHub.

---

## 📂 Estrutura geral do projeto

```text
app-admMatrip/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── README.md
```

A estrutura pode variar de acordo com a organização adotada durante o desenvolvimento.

---

## ✅ Pré-requisitos

Antes de executar o projeto, é necessário possuir as seguintes ferramentas instaladas:

* Git;
* Node.js;
* NPM;
* Java JDK 17 ou superior;
* Maven;
* MySQL;
* Visual Studio Code ou outra IDE;
* Android Studio, caso o aplicativo seja executado em um emulador Android.

---

## 🚀 Como executar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd app-admMatrip
```

---

### 2. Configurar o banco de dados

Crie um banco de dados no MySQL:

```sql
CREATE DATABASE matrip;
```

Configure o arquivo `application.properties` do back-end:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/matrip
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Não publique usuários, senhas ou outras informações sensíveis no GitHub.

---

### 3. Executar o back-end

Acesse a pasta do back-end:

```bash
cd backend
```

Execute o projeto com Maven:

```bash
mvn spring-boot:run
```

Por padrão, a API poderá ser acessada em:

```text
http://localhost:8080
```

---

### 4. Instalar as dependências do front-end

Em outro terminal, acesse a pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

---

### 5. Executar o front-end

Para iniciar o projeto:

```bash
npm start
```

Dependendo da configuração utilizada, também poderão ser usados os comandos:

```bash
npm run dev
```

ou:

```bash
npx expo start
```

---

## 🔗 Integração com a API

O front-end realiza requisições para a API REST desenvolvida com Spring Boot.

Exemplo de configuração da URL da API:

```javascript
const API_URL = "http://localhost:8080";
```

Exemplos de recursos disponibilizados pela API:

```text
/api/parceiros
/api/agencias
/api/guias
/api/produtos
/api/vendas
/api/pagamentos
/api/avaliacoes
/api/localidades
```

Os endereços podem ser alterados conforme a implementação do back-end.

---

## 🔐 Segurança

O aplicativo administrativo deve possuir acesso restrito aos administradores autorizados.

Entre as medidas previstas para o sistema estão:

* Autenticação de administradores;
* Controle de permissões;
* Proteção das rotas administrativas;
* Validação dos dados recebidos;
* Armazenamento seguro de senhas;
* Registro das operações realizadas;
* Proteção de informações pessoais e financeiras.

---

## 🌐 Ecossistema Matrip

O projeto Matrip é composto pelos seguintes sistemas:

* `app-cliente`: aplicativo destinado aos turistas;
* `app-parceiro`: aplicativo destinado às agências e aos guias;
* `app-admMatrip`: aplicativo administrativo;
* Plataforma Web;
* API REST do back-end.

Todos os sistemas trabalham de forma integrada para melhorar a experiência do turista e a logística dos serviços turísticos.

---

## 🎯 Objetivos do aplicativo

* Centralizar a administração da plataforma;
* Facilitar o gerenciamento de parceiros e produtos;
* Acompanhar vendas e pagamentos;
* Garantir maior controle sobre o conteúdo publicado;
* Moderar avaliações e comentários;
* Valorizar a história e a cultura do Maranhão;
* Melhorar a segurança e a confiabilidade das operações;
* Apoiar o crescimento do turismo local.

---

## 📈 Status do projeto

🚧 Projeto em desenvolvimento.

Funcionalidades, telas, rotas e estruturas poderão ser modificadas durante a evolução do sistema.

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. Crie uma nova branch:

```bash
git checkout -b nome-da-funcionalidade
```

2. Faça as alterações necessárias.

3. Adicione os arquivos modificados:

```bash
git add .
```

4. Realize o commit:

```bash
git commit -m "feat: descrição da funcionalidade"
```

5. Envie a branch para o GitHub:

```bash
git push origin nome-da-funcionalidade
```

6. Abra um Pull Request para análise da equipe.

---

## 📝 Padrão de commits

Exemplos de mensagens de commit:

```text
feat: adiciona cadastro de parceiros
fix: corrige cancelamento de vendas
docs: atualiza documentação do projeto
style: ajusta layout da tela administrativa
refactor: reorganiza serviço de produtos
test: adiciona testes para cadastro de agências
```

---

## 👨‍💻 Equipe

Projeto desenvolvido pela equipe da **Matrip — Tecnologia e Turismo**.

---

## 📄 Licença

Este projeto é de uso interno da Matrip.

A reprodução, distribuição ou utilização do código sem autorização da equipe responsável não é permitida.
