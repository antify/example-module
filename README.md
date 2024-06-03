# Example module


# Development

- Start mongo database with `docker compose up -d`
- Run `pnpm run dev:prepare` to generate type stubs.
- Use `pnpm run dev` to start [playground](playground) in development mode.

# e2e tests

- Navigate to e2e project root `cd e2e`
- Build and start containers with `docker compose up --build`
- Install dependencies with `pnpm i`
- Start and use cypress with `pnpm cy:open`

For the impatient ones: 
	
	cd e2e && docker compose up --build && pnpm i && pnpm cy:open
