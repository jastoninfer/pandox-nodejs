# Pandox Blog Platform Backend

Portfolio case study for the backend of Pandox, a full-stack technical blogging platform. The backend is a TypeScript/Node.js API that powers authentication, users, articles, comments, likes, follows, image uploads, and Elasticsearch-backed search.

## Reviewer Snapshot

| Area | Summary |
| --- | --- |
| Product | Technical blogging platform for long-form articles with profiles, comments, social actions, and search |
| Backend scope | Express REST API, Sequelize data model, auth middleware, seed pipeline, image handling, search endpoints |
| Core services | MySQL, Redis, local image storage |
| Search service | Elasticsearch, originally populated from MySQL through Logstash JDBC sync |
| Current demo status | The Oracle VPS is offline. The project is best reviewed locally with seeded MySQL/Redis data; Elasticsearch can be enabled separately for search. |

## Engineering Highlights

- Designed a TypeScript Express backend with explicit route, controller, middleware, model, and config layers.
- Modeled users, pages, comments, threads, images, page keywords, likes, and follows with Sequelize associations.
- Implemented JWT authentication, protected route middleware, and Redis-backed token/user invalidation.
- Built a repeatable seed process that recreates tables and loads demo users, Markdown pages, images, comments, and keywords from static resources.
- Added image upload and retrieval through Multer and local filesystem storage.
- Implemented Elasticsearch search endpoints for page and user search; used Logstash to sync MySQL rows into ES indexes.

## Skills Demonstrated

| Skill | Evidence in this project |
| --- | --- |
| API design | Separate routers/controllers for auth, users, pages, comments, images, likes, follows, keywords, and search |
| Data modeling | Sequelize models and associations for one-to-many and many-to-many social/blog relationships |
| Auth/security | JWT issuance, auth middleware, Redis invalidation, environment-based secret configuration |
| Data seeding | Local demo content generated from Markdown, images, and comments for reproducible review |
| Search architecture | Elasticsearch query endpoints and documented Logstash JDBC indexing pipeline |
|

## API Surface

| Domain | Representative routes |
| --- | --- |
| Auth | `POST /api/access/auth/signup`, `POST /api/access/auth/signin`, `POST /api/access/auth/logout` |
| Pages | `GET /api/db/pagerecommend`, `GET /api/db/pages/:pageId`, `POST /api/db/pages`, `PUT /api/db/pages/:pageId` |
| Users | profile retrieval, profile update, account rename, account deletion |
| Comments/threads | page discussion threads and comment flows |
| Images | `POST /api/db/images`, `GET /api/db/images/:username/:imageId` |
| Social | likes and follows |
| Search | `GET /api/db/es/pages/:keyword/:pageIdx`, `GET /api/db/es/users/:keyword/:userIdx` |

## Local Review Appendix

Use Node 22 where possible. Very new Node versions may expose old transitive dependency issues unless JWT dependencies are updated.

```bash
npm install
cp .env.example .env
npm run dev
```

Expected backend environment:

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

