# Reznichuk Mykola Sportserve Backend Test App

Link to github: [sportserve_backend_task](https://github.com/nickreznichuk/sportserve_backend_task).

## Commands to run in docker

```bash
docker-compose build
```

```bash
docker-compose up
```

#### To run in background mode

```bash
docker-compose up -d
```

## Commands for development

```bash
yarn dev
```

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3000) to view it in the browser.

Use params page and limit for pagination \
[http://localhost:3001/api/transactions](http://localhost:3000/api/transactions) - list of transactions in the browser. \
[http://localhost:3001/api/transactions/:address](http://localhost:3000/api/transactions/:address) - list of transactions filtered by address in the browser. \
[http://localhost:3001/api/transfers-total/:address](http://localhost:3000/api/transfers-total/:address) - list of total transfers filtered by address in the browser. \
[http://localhost:3001/api/interactions/:address](http://localhost:3000/api/interactions/:address) - list of interaction filtered by address in the browser.

```bash
yarn lint
```

Run EsLint and prettier to show code warnings and problems.

```bash
yarn format
```

Run EsLint and prettier to fix code warnings and problems
