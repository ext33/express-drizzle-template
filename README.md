# Express + Drizzle + PostgreSQL Template

Based on Express + Drizzle + PostgreSQL template with basic auth and swagger.

## Starting server

### Start dev
```bash
docker-compose --env-file ./config/.dev.env -f docker-compose.yml up --build
```

### Start prod
with compose
```bash
docker-compose --env-file ./config/.prod.env -f docker-compose.yml up --build -d
```

standalone
```bash
docker build -t w-stories-server .
docker run -d -p 8080:8080 --env-file ./config/.prod.env w-stories-server -c 'bash entrypoint-deploy.sh'
```
