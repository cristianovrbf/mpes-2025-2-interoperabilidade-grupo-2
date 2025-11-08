# IoT Web Application

Aplicação web full-stack para monitoramento e visualização de dados de sensores IoT coletados por uma placa ESP32.

## 📋 Descrição

Este projeto consiste em uma aplicação web que exibe dados de sensores IoT em tempo real. Os dados são coletados por uma **placa ESP32** e armazenados no Firebase Realtime Database, sendo posteriormente consumidos e visualizados através de uma interface web moderna.

## 🏗️ Arquitetura

O projeto é dividido em duas partes principais:

- **Back-end**: API desenvolvida com NestJS que gerencia a comunicação com o Firebase
- **Front-end**: Interface web desenvolvida com React, TypeScript e Vite para visualização dos dados

### Arquitetura Hexagonal (Ports and Adapters)

Ambas as aplicações seguem os princípios da **Arquitetura Hexagonal**, garantindo isolamento de dependências, testabilidade e flexibilidade:

#### Back-end
- **[application/](back-end/src/application/)** - Casos de uso (núcleo da aplicação, regras de negócio)
- **[infra/](back-end/src/infra/)** - Adaptadores externos (Firebase, repositórios)
- **[presentation/](back-end/src/presentation/)** - Portas de entrada (Controllers HTTP, Tasks)

#### Front-end
- **[application/](front-end/src/application/)** - Gateways (portas de saída para APIs)
- **[shared/infra/](front-end/src/shared/infra/)** - Adaptadores (HTTP client, Router, DI)
- **[pages/](front-end/src/pages/)** - Componentes de apresentação

**Principais características:**
- Inversão de dependências através de interfaces abstratas
- Camadas bem definidas e isoladas
- Dependency Injection (DI) para gerenciamento de dependências
- Múltiplas implementações dos gateways (HTTP e InMemory para testes)

## 🚀 Tecnologias Utilizadas

### Back-end
- NestJS
- Firebase Admin SDK
- TypeScript
- Node.js

### Front-end
- React 19
- TypeScript
- Vite
- Axios
- Chart.js (para visualização de dados)
- React Router DOM

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Credenciais do Firebase configuradas

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd iot-web-application
```

### 2. Configuração do Back-end

```bash
cd back-end
npm install
```

Configure as credenciais do Firebase:
- Adicione o arquivo de credenciais do Firebase na pasta do back-end
- Configure as variáveis de ambiente necessárias

### 3. Configuração do Front-end

```bash
cd front-end
npm install
```

## 🎯 Como Executar

### Executar o Back-end

```bash
cd back-end

# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

O servidor back-end estará disponível em `http://localhost:3000` (ou conforme configurado).

### Executar o Front-end

```bash
cd front-end

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm run preview
```

O front-end estará disponível em `http://localhost:5173` (ou conforme configurado pelo Vite).

## 📊 Fonte de Dados

Os dados exibidos na aplicação são provenientes de **sensores conectados a uma placa ESP32**, que envia as leituras para o Firebase Realtime Database. O back-end consome esses dados e os disponibiliza através de uma API REST para o front-end.

## 🛠️ Scripts Disponíveis

### Back-end
- `npm run start` - Inicia o servidor
- `npm run start:dev` - Inicia em modo desenvolvimento com watch
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes

### Front-end
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 📝 Estrutura do Projeto

```
iot-web-application/
├── back-end/          # API NestJS
│   ├── src/
│   ├── test/
│   └── package.json
├── front-end/         # Aplicação React
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Desenvolvimento

Para desenvolvimento local, certifique-se de que tanto o back-end quanto o front-end estejam rodando simultaneamente.

## 📄 Licença

UNLICENSED
