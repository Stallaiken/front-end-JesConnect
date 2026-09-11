# Testes do Projeto

Para Realizar os testes do projeto Jes Connect siga as etapas a baixo.

## 1. Requisitos

Antes de executar os testes, é necessário ter instalado:

- Node.js
- npm

O projeto utiliza o Vitest para os testes automatizados.

---

## 2. Instalação do projeto

Depois de baixar/clonar o projeto, abra o terminal na pasta do projeto e execute:

```bash

npm install


```
Caso o Vitest ainda não esteja instalado, execute:
```bash

npm install -D vitest

```
Para os testes de API também será utilizado o Supertest:

```bash
npm install -D supertest

```

## 3. Para execultar os testes: 
```bash

npm run test

```

## 4. Pastas
O projeto está separado em pastas a pasta (test) está localizado os tests feitos no vitest.

Para melhor organização os testes foram separados em banco, integração e unitarios.