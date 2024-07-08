# Backend for the Pandox Blog Platform
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)

## Overview 📝

Welcome to the backend repository for the Pandox Blog Platform. This project is built with TypeScript and Node.js, providing a robust and scalable backend solution for our blog platform.

Frontend URL: [The Pandox Blog Platform](https://pandox-reactjs.vercel.app/)

## Table of Contents 📚

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation⚙️](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)

## Features

- Authentication and Authorization 🔒
- User Management 🔒
- Blog Post Creation and Management 📝
- Comments, Likes, and Follows 💬👍👣
- Image Upload and Management 📷
- Search Functionality using Elasticsearch 🔍
- User Permissions Management with Redis 🔐
- Real-time Messaging with WebSockets (Pending Implementation) 💬

## Technologies Used

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL database management
- **MySQL** - Database for storing blog posts, user information, etc.
- **Redis** - Database for managing user permissions
- **Elasticsearch** - Search engine for search functionality
- **WebSocket** - Real-time communication (Pending Implementation)
- **ESLint** - Linting tool for maintaining code quality
- **Prettier** - Code formatter

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/jastoninfer/pandox-nodejs.git
    ```

2. Navigate to the project directory:
    ```sh
    cd pandox-nodejs
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add your environment variables. Refer to `app/config/env.config.ts` for the required configurations. Below is an example of the necessary environment variables:
```sh
MYSQL_PWD=MyNewPass4!
MYSQL_DB=testdb
PORT=8080
PROD_URL=https://www.pandox.xyz
```

## Running the Project

### Development Mode

To run the project in development mode, use the following command:
```sh
npm run dev
```
### Production Mode
To run the project in production mode, use the following command:
```sh
npm run prod
```