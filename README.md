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

## Using PostgreSQL instead of SQLite

This is what the Heroku deployment used.

1. Install the driver:

   ```
   npm install pg
   ```

2. Replace the contents of `ormconfig.json` with the following, filling in your own connection details:

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

3. Do not commit `ormconfig.json` with real credentials. Add it to `.gitignore`.
