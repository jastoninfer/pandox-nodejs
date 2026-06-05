# Pandox Blog Platform Backend

Backend for Pandox, a full-stack technical blogging platform. It is a TypeScript/Node.js API for authentication, users, articles, comments, likes, follows, image uploads, and Elasticsearch search.

## Project Summary

| Area | Summary |
| --- | --- |
| Product | Technical blogging platform for long-form articles with profiles, comments, social actions, and search |
| Backend scope | Express REST API, Sequelize models, auth middleware, seed script, image handling, and search routes |
| Core services | MySQL, Redis, local image storage |
| Search service | Elasticsearch, with data originally synced from MySQL through Logstash JDBC |
| Demo status | The Oracle VPS is offline. The project can be reviewed locally with seeded MySQL and Redis data. Elasticsearch can be enabled separately for search. |

## Engineering Highlights

- Built a TypeScript Express API with separate routes, controllers, middleware, models, and config files.
- Modeled users, pages, comments, threads, images, page keywords, likes, and follows with Sequelize associations.
- Added JWT login, protected routes, and Redis-based logout/token invalidation.
- Added a seed script that recreates tables and loads demo users, Markdown pages, images, comments, and keywords from local files.
- Added image upload and retrieval with Multer and local filesystem storage.
- Added Elasticsearch routes for page and user search, with a Logstash JDBC setup for syncing MySQL rows into Elasticsearch indexes.

## Skills Shown

| Skill | Evidence in this project |
| --- | --- |
| API design | Separate routers and controllers for auth, users, pages, comments, images, likes, follows, keywords, and search |
| Data modeling | Sequelize models and associations for one-to-many and many-to-many social/blog relationships |
| Auth/security | JWT tokens, auth middleware, Redis token invalidation, and environment-based secrets |
| Local demo data | Seeded users, articles, images, comments, and keywords for local review |
| Search setup | Elasticsearch query routes and documented Logstash JDBC indexing |

## Main API Areas

| Domain | Representative routes |
| --- | --- |
| Auth | `POST /api/access/auth/signup`, `POST /api/access/auth/signin`, `POST /api/access/auth/logout` |
| Pages | `GET /api/db/pagerecommend`, `GET /api/db/pages/:pageId`, `POST /api/db/pages`, `PUT /api/db/pages/:pageId` |
| Users | profile retrieval, profile update, account rename, account deletion |
| Comments/threads | page discussion threads and comment flows |
| Images | `POST /api/db/images`, `GET /api/db/images/:username/:imageId` |
| Social | likes and follows |
| Search | `GET /api/db/es/pages/:keyword/:pageIdx`, `GET /api/db/es/users/:keyword/:userIdx` |

## Run Locally

Use Node 22 where possible. Very new Node versions may expose old transitive dependency issues unless JWT dependencies are updated.

```bash
npm install
cp .env.example .env
npm run dev
```

Expected backend `.env`:

```bash
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PWD=replace-with-your-local-password
MYSQL_DB=testdb
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_HOST=http://localhost:9200
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE_SECONDS=86400
JWT_ALGORITHM=HS256
PORT=8080
PROD_URL=https://your-backend-domain.example.com
```

Seeded login accounts:

| Username | Password |
| --- | --- |
| `pandoxone` | `1234` |
| `jzhang` | `1234` |
| `mshao` | `1234` |
