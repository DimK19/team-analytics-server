# Team Analytics Server

Backend of a web application that analyses a Pokemon team. It receives a team as JSON, works out type matchups using Prolog, and returns the analysis.

Client: https://github.com/DimK19/team-analytics-client

## Endpoints

`POST /team` accepts a team of six Pokemon (name, nature, EVs, IVs) and returns:

- For each member, the damage multiplier taken from each of the 18 types (0, 0.25, 0.5, 2, 4).
- Unresisted type pairs: pairs of attacking types for which no team member resists both.
- Weak type pairs: pairs of attacking types for which every team member is weak to at least one.
- The team’s EV distribution and a count of offensive, defensive and speed natures.
- The highest and lowest speed on the team.

Type and base speed data is read from a database table. Pokémon not yet in the table are fetched from [PokeAPI](https://pokeapi.co/) and stored.

The type chart and the matchup rules are written in Prolog (`predicatesxy.pl`) and queried from Node.js with Tau Prolog.

Other endpoints: `GET /mon`, `GET /mon/:id`, `POST /mon/create`.

## Technologies

- [NestJS](https://nestjs.com/) (TypeScript)
- [Tau Prolog](http://tau-prolog.org/)
- TypeORM with SQLite (PostgreSQL also supported for web deployment, see below)
- PokeAPI, via `@nestjs/axios`
- Previously deployed on Heroku (`Procfile`)

## Running

```
npm install
npm run start:dev
```

The server listens on port 3000, or on `PORT` if set.

Production: `npm run build` then `npm run start:prod`.

## Switching from SQLite to PostgreSQL

By default the server stores the Pokémon cache in SQLite. The Heroku deployment used PostgreSQL instead, because Heroku’s filesystem is not persistent. These are the changes involved.

### 1. Swap the database driver

```
npm uninstall sqlite3
npm install pg
```

This replaces `"sqlite3": "^5.0.8"` with `"pg": "^8.8.0"` in `package.json`. TypeORM picks the driver from the `type` field in `ormconfig.json`.

### 2. Point TypeORM at PostgreSQL

Replace the contents of `ormconfig.json` with the following, filling in your own connection details:

```json
{
    "type": "postgres",
    "host": "<host>",
    "port": 5432,
    "username": "<username>",
    "password": "<password>",
    "database": "<database>",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "ssl": true,
    "extra": {
        "ssl": {
            "rejectUnauthorized": false
        }
    },
    "synchronize": true,
    "logging": true
}
```

- `ssl` and `rejectUnauthorized: false` are required by Heroku Postgres. Remove both for a local database without SSL.
- `synchronize: true` creates the `mon` table automatically on startup.
- Do not commit `ormconfig.json` with real credentials. Add it to `.gitignore`.

### 3. Read the port from the environment

Heroku assigns the port through the `PORT` variable. In `src/main.ts`, change:

```ts
await app.listen(3000);
```

to:

```ts
await app.listen(process.env.PORT || 3000);
```

### 4. Add a Procfile

For Heroku, create a `Procfile` in the repository root containing:

```
web: npm run start:prod
```

Build the project (`npm run build`) before starting in production mode.
