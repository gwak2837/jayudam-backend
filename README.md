# 자유담 백엔드

자유담 프론트엔드에서 필요한 데이터를 제공하는 API 서버

## 💻 Requirements

- macOS 11.5 or Windows Edu 21H2
- Node.js 18.2
- Yarn 3.2
- Git 2.36
- Docker 20.10
- Docker compose 2.6
- PostgreSQL 14.3
- Redis 7

## 📦 Installation

#### Download codes

```
git clone https://github.com/rmfpdlxmtidl/jayudam-backend.git
cd jayudam-backend
git checkout main
yarn
```

#### Initialize database

PostgreSQL 서버에 접속해서 사용자와 데이터베이스를 생성합니다.

```sql
CREATE USER DB사용자이름 WITH PASSWORD 'DB사용자비밀번호';
CREATE DATABASE DB이름 OWNER DB사용자이름 TEMPLATE template0 LC_COLLATE "C" LC_CTYPE "ko_KR.UTF-8";

\c jayudam postgres
ALTER SCHEMA public OWNER TO jayudam_admin;
```

#### Create environment variables

루트 폴더에 아래와 같은 내용이 담긴 환경 변수 파일을 생성합니다.

```
PORT=

GOOGLE_CLOUD_STORAGE_BUCKET=

JWT_SECRET_KEY=

CONNECTION_STRING=postgresql://DB사용자이름:DB사용자암호@DB주소:DB포트/DB이름
```

- `.env.development.local`: `yarn dev` 스크립트 실행 시 필요
- `.env.local`: `yarn start` 스크립트 실행 시 필요

#### Start Node.js server

1. TypeScript 파일을 그대로 사용해 Nodemon으로 서비스를 실행합니다.

```
yarn dev
```

2. TypeScript 파일을 JavaScript로 트랜스파일한 후 Node.js로 서비스를 실행합니다.

```
yarn build && yarn start
```

3. Docker 환경에서 Node.js 서버를 실행합니다.

```
docker-compose up --detach --build --force-recreate
```

## 설치 과정

```
mkdir jayudam-backend && cd jayudam-backend
git init
```

.gitignore \
https://www.toptal.com/developers/gitignore/api/node

Yarn 3 \
https://yarnpkg.com/getting-started/install \
https://yarnpkg.com/getting-started/recipes \
https://yarnpkg.com/cli/upgrade-interactive

package.json \
https://docs.npmjs.com/cli/v8/configuring-npm/package-json

TypeScript \
https://www.typescriptlang.org/download \

tsconfig.json (Node.js 18) \
https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008

ESLint \
https://eslint.org/docs/user-guide/getting-started

ESLint plugin \
https://github.com/standard/eslint-config-standard \
https://github.com/import-js/eslint-plugin-import \
https://github.com/weiran-zsd/eslint-plugin-node#readme \
https://github.com/xjamundx/eslint-plugin-promise \
https://github.com/jest-community/eslint-plugin-jest

Prettier \
https://prettier.io/docs/en/install.html

ESLint + Prettier \
https://github.com/prettier/eslint-config-prettier \

Yarn 3 + VSCode + ESLint + Prettier \
https://yarnpkg.com/getting-started/editor-sdks \

Husky \
https://typicode.github.io/husky/#/?id=usage \

PostgreSQL Client \
https://node-postgres.com/ \

PostgreSQL + TypeScript \
https://pgtyped.vercel.app/docs/getting-started \

Apollo Server + Express \
https://www.apollographql.com/docs/apollo-server/integrations/middleware \

Apollo Server + Redis \
https://www.apollographql.com/docs/apollo-server/data/data-sources/#using-memcachedredis-as-a-cache-storage-backend \

GraphQL Scalars \
https://www.graphql-scalars.dev/docs/quick-start \

GraphQL Codegen \
https://www.graphql-code-generator.com/docs/getting-started/installation \

esbuild \
https://esbuild.github.io/getting-started/ \

Nodemon + esbuild watch + GraphQL Codegen watch + pgtyped watch \
(Input `rs` on terminal after `yarn dev` on the first try) \
https://github.com/remy/nodemon#nodemon \
https://stackoverflow.com/a/35455532/16868717 \
https://www.graphql-code-generator.com/docs/config-reference/codegen-config#configuration-options \
https://pgtyped.vercel.app/docs/cli#flags \

Dockerfile \
https://docs.docker.com/engine/reference/builder/ \
https://hub.docker.com/_/node \

docker-compose.yml \
https://docs.docker.com/compose/compose-file/ \

Jest \
https://jestjs.io/docs/getting-started \

Database import/export \
https://dba.stackexchange.com/questions/137140/how-can-i-dump-all-tables-to-csv-for-a-postgresql-schema \
https://www.postgresqltutorial.com/postgresql-tutorial/export-postgresql-table-to-csv-file/ \

Kakao OAuth

Google OAuth

Naver OAuth

BBaton OAuth

Cloud (GCP, Azure)

Redis 활용해서 JWT 유효시간 넣어서 logout 구현
