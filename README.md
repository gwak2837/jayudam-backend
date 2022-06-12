# 자유담 백엔드

자유담 프론트엔드에서 필요한 데이터를 제공하는 API 서버

## 💻 Requirements

- macOS 11.5 (or Windows 10 Edu 21H2 with minor errors)
- [Node.js](https://nodejs.org/en/) 18.2
- [Yarn](https://yarnpkg.com/getting-started/install#install-corepack) 3.2
- [Git](https://git-scm.com/download) 2.36
- [Docker](https://www.docker.com/products/docker-desktop/) 20.10
- Docker compose 2.6
- [PostgreSQL](https://www.postgresql.org/download/) 14.3
- [Redis](https://redis.io/download/) 7.0

## 📦 Installation

#### Download codes

프로젝트 소스코드를 다운로드 받고 의존 패키지를 설치합니다.

```
git clone https://github.com/rmfpdlxmtidl/jayudam-backend.git
cd jayudam-backend
git checkout main
yarn
```

#### Start PostgreSQL server and initialize

PostgreSQL 서버에 접속해서 아래와 같이 사용자와 데이터베이스를 생성합니다.

```sql
CREATE USER DB사용자이름 WITH PASSWORD 'DB사용자비밀번호';
CREATE DATABASE DB이름 OWNER DB사용자이름 TEMPLATE template0 LC_COLLATE "C" LC_CTYPE "ko_KR.UTF-8";

\c DB이름 관리자이름(e.g. postgres)
ALTER SCHEMA public OWNER TO DB사용자이름;
```

그리고 아래 스크립트를 실행해 데이터베이스에 더미 데이터를 넣어줍니다.

```
yarn import
```

#### Start Redis server

Redis 서버를 실행합니다.

```bash
redis-server --loglevel warning
```

#### Create environment variables

루트 폴더에 아래와 같은 내용이 담긴 환경 변수 파일을 생성합니다.

필요한 환경변수 목록은 [`src/utils/constants.ts`](src/utils/constants.ts) 파일 안에 있습니다.

- `.env.development.local`: `yarn dev` 실행 시 필요
- `.env.local`: `yarn start` 실행 시 필요
- `.env.local.docker`: `docker-compose up` 실행 시 필요
- `.env.test`: `yarn test` 실행 시 필요 (예정)

#### Start Node.js server

1. 동적 번들링 및 Nodemon으로 서비스를 실행합니다.

```
yarn dev
```

2. TypeScript 파일을 JavaScript로 트랜스파일 및 번들링 후 Node.js로 서비스를 실행합니다.

```
yarn build && yarn start
```

3. Docker 환경에서 Node.js 서버, PostgreSQL 서버, Redis 서버를 실행합니다.

```
docker-compose --env-file .env.local.docker up --detach --build --force-recreate
```

#### CI/CD

GitHub에 push 할 때마다 자동으로 `Cloud Build`에서 새로운 Docker 이미지를 만들어서 `Container Registry`에 저장합니다. 그리고 `Cloud Run`에 요청이 들어오면 새로운 이미지를 기반으로 Docker 컨테이너를 생성합니다.

## ☁ Cloud

- [Google Cloud Run](https://cloud.google.com/run)
- [Google Cloud Storage](https://cloud.google.com/storage)
- [Google Cloud Build](https://cloud.google.com/build)
- [Google Container Registry](https://cloud.google.com/container-registry)
- [Oracle Virtual Machine](https://www.oracle.com/kr/cloud/compute/virtual-machines/)
- Azure Cosmos DB?

#### PostgreSQL

SSL with Docker

```
# Set variables
DOCKER_VOLUME_NAME=도커볼륨이름
POSTGRES_HOST=DB서버주소
POSTGRES_USER=DB계정이름
POSTGRES_PASSWORD=DB계정암호
POSTGRES_DB=DB이름

# generate the server.key and server.crt https://www.postgresql.org/docs/14/ssl-tcp.html
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=Alpacasalon"
chmod og-rwx root.key

openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt

openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=$POSTGRES_HOST"

openssl x509 -req -in server.csr -text -days 365 \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out server.crt

# set postgres (alpine) user as owner of the server.key and permissions to 600
sudo chown 0:70 server.key
sudo chmod 640 server.key

# set client connection policy
echo "
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# 'local' is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust

hostssl all all all scram-sha-256
" > pg_hba.conf

# start a postgres docker container, mapping the .key and .crt into the image.
sudo docker volume create $DOCKER_VOLUME_NAME
sudo docker run \
  -d \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e LANG=ko_KR.UTF8 \
  -e LC_COLLATE=C \
  -e POSTGRES_INITDB_ARGS=--data-checksums \
  --name postgres \
  -p 5432:5432 \
  --restart=always \
  --shm-size=256MB \
  -v "$PWD/server.crt:/var/lib/postgresql/server.crt:ro" \
  -v "$PWD/server.key:/var/lib/postgresql/server.key:ro" \
  -v "$PWD/pg_hba.conf:/var/lib/postgresql/pg_hba.conf" \
  -v $DOCKER_VOLUME_NAME:/var/lib/postgresql/data \
  postgres:14-alpine \
  -c ssl=on \
  -c ssl_cert_file=/var/lib/postgresql/server.crt \
  -c ssl_key_file=/var/lib/postgresql/server.key \
  -c hba_file=/var/lib/postgresql/pg_hba.conf
```

#### Redis

SSL with Docker

```

```

## ⚙️ Configuration

```
mkdir jayudam-backend && cd jayudam-backend
git init
```

#### .gitignore

https://www.toptal.com/developers/gitignore/api/node

#### Yarn 3

https://yarnpkg.com/getting-started/install \
https://yarnpkg.com/getting-started/recipes \
https://yarnpkg.com/cli/upgrade-interactive

#### package.json

https://docs.npmjs.com/cli/v8/configuring-npm/package-json

#### TypeScript

https://www.typescriptlang.org/download \

#### tsconfig.json (Node.js 18)

https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008

#### ESLint

https://eslint.org/docs/user-guide/getting-started

#### ESLint plugin

https://github.com/standard/eslint-config-standard \
https://github.com/import-js/eslint-plugin-import \
https://github.com/weiran-zsd/eslint-plugin-node#readme \
https://github.com/xjamundx/eslint-plugin-promise \
https://github.com/jest-community/eslint-plugin-jest

#### Prettier

https://prettier.io/docs/en/install.html

#### ESLint + Prettier

https://github.com/prettier/eslint-config-prettier \

#### Yarn 3 + VSCode + ESLint + Prettier

https://yarnpkg.com/getting-started/editor-sdks \

#### Husky

https://typicode.github.io/husky/#/?id=usage \

#### PostgreSQL Client

https://node-postgres.com/ \

#### PostgreSQL + TypeScript

https://pgtyped.vercel.app/docs/getting-started \

#### Apollo Server + Express

https://www.apollographql.com/docs/apollo-server/integrations/middleware \

Apollo Server + Redis \
https://www.apollographql.com/docs/apollo-server/data/data-sources/#using-memcachedredis-as-a-cache-storage-backend \

#### GraphQL Scalars

https://www.graphql-scalars.dev/docs/quick-start \

#### GraphQL Codegen

https://www.graphql-code-generator.com/docs/getting-started/installation \

#### esbuild

https://esbuild.github.io/getting-started/ \

#### Nodemon + esbuild watch + GraphQL Codegen watch + pgtyped watch

(Input `rs` on terminal after `yarn dev` on the first try) \
https://github.com/remy/nodemon#nodemon \
https://stackoverflow.com/a/35455532/16868717 \
https://www.graphql-code-generator.com/docs/config-reference/codegen-config#configuration-options \
https://pgtyped.vercel.app/docs/cli#flags \

#### Dockerfile

https://docs.docker.com/engine/reference/builder/ \
https://hub.docker.com/_/node \

#### compose.yaml

https://docs.docker.com/compose/compose-file/ \

#### Jest

https://jestjs.io/docs/getting-started \

#### Database import/export

https://dba.stackexchange.com/questions/137140/how-can-i-dump-all-tables-to-csv-for-a-postgresql-schema \
https://www.postgresqltutorial.com/postgresql-tutorial/export-postgresql-table-to-csv-file/ \

#### Kakao OAuth

https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api \

#### Naver OAuth

https://developers.naver.com/docs/login/web/web.md \

#### BBaton OAuth

https://www.bbaton.com/docs/%ec%97%b0%eb%8f%99%ed%95%98%ea%b8%b0/ \

#### Google OAuth

https://developers.google.com/identity/protocols/oauth2/web-server#obtainingaccesstokens \

#### Cloud

https://stackoverflow.com/questions/70784083/how-to-deploy-a-full-stack-node-js-project \

#### Cloud Run

https://stackoverflow.com/questions/2387724/node-js-on-multi-core-machines/8685968#8685968 \
https://stackoverflow.com/questions/70364483/will-node-js-deployed-on-google-cloudrun-utilize-multiple-cores \
https://www.nearform.com/blog/solving-the-serverless-concurrency-problem-with-google-cloud-run/ \

#### Cloud Storage

https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage \
https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-nodejs \

#### Payment

아임포트 결제 모듈 연동
카카오페이 수동 연동

#### ELK

## 📚 References

Node.js 특징 \
https://stackoverflow.com/a/34857298/16868717 \

How to connect to the localhost of the machine from inside of a Docker container? \
https://stackoverflow.com/a/24326540/16868717 \

Google storage \
https://stackoverflow.com/questions/20812676/what-do-gcs-bucket-permissions-all-users-and-all-authenticated-users-and-the
