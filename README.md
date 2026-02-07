# Nobzo Blog API Backend Server

This repository contains the source code for the Blog REST API built as part of the technical evaluation for Nobzo Ent. The objective is to demonstrate skills in authentication, data relationships, and clean API design using Node.js, Express, MongoDB, and Mongoose

---

## Tech Stack

The following technologies were used to build this API:

- Node.js
- Express.js
- MongoDB
- Mongoose

> Additional libraries used for features like authentication, validation, and security include `jsonwebtoken`, `argon2`, `slugify`, `zod`, `helmet`, and `cors`

---

## Setup Instructions

Follow these steps to run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/PhilipOyelegbin/nobzo-blog.git

   cd nobzo-blog
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create .env file:

   Create a file named .env in the `backend` directory from the `.env.example` template. There is a docker compose file if you chose to use a local mongodb database

4. Start the server in development mode:

   ```bash
   cd backend
   pnpm run dev

   # or use the start script in the script folder to run start the database and application

   chmod 740 scripts/*
   ./scripts/start.sh
   ```

   > The server will run on the port specified in your .env file (e.g., http://localhost:3001).

   Destroy the database server with the volume using the command `docker compose down --volumes`.

---

## API Endpoints and Sample Requests

The API base route is /api.

### Authentication

**Register a User**

- Endpoint: `POST /api/auth/register`
- Body:

  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "StrongPassword123"
  }
  ```

**Login a User**

- Endpoint: `POST /api/auth/login`
- Body:

  ```json
  {
    "email": "jane.doe@example.com",
    "password": "StrongPassword123"
  }
  ```

### Posts (Authentication required for create/update/delete)

Authenticated users must provide a Bearer <TOKEN> in the Authorization header.

**Get Public Posts (with Filtering and Pagination)**

- Endpoint: `GET /api/posts?page=1&limit=12&search=express&tag=tech&author=<authorId>`

**Create a Post (Auth Required)**

- Endpoint: `POST /api/posts`
- Headers: `Authorization: Bearer <TOKEN>`
- Body:

  ```json
  {
    "title": "My First Express Blog Post",
    "content": "This is the amazing content of my first blog post.",
    "status": "published",
    "tags": ["node", "express", "tech"]
  }
  ```

**Update a Post (Author Only)**

- Endpoint: `PUT /api/posts/:id`
- Headers: `Authorization: Bearer <TOKEN>`
- Body: (e.g., just updating the title)

  ```json
  {
    "title": "My Updated Blog Post Title"
  }
  ```

**Delete a Post (Soft Delete, Author Only)**

- Endpoint: `DELETE /api/posts/:id`
- Headers: `Authorization: Bearer <TOKEN>`

---

## Task Completed

- [x] User registration and authentication
- [x] User managment by authenticated user
- [x] Post creation, update and delete by authenticated user
- [x] Post and post details view by the public

---
