# Link Manager

#### DB Schema

```

    ┌──────────────────────────┐             ┌───────────────────────────┐
    │      User Schema         │             │         Shortcuts         │
    ├────────────┬─────────────┤             ├─────────────┬─────────────┤
    │ id         │ uuid        ├─1─────┐     │ id          │ uuid        │
    │ first_name │ varchar     │       └──*──┤ user_id     │ uuid        │
    │ last_name  │ varchar     │             │ short_link  │ varchar     │
    │ email      │ varchar     │             │ description │ varchar     │
    │ password   │ varchar     │             │ source_url  │ varchar     │
    │ created_at │ timestamptz │             │ tags        │ varchar[]   │
    │            │             │             │ created_at  │ timestamptz │
    └────────────┴─────────────┘             └─────────────┴─────────────┘

```

Note:

1. The id fields are the primary keys
2. email field in users table & short_link field in shortcuts table are unique
3. created_at has a default value set to `now`

---

#### Steps to follow once you clone the repository.
1. I've used yarn for package management but you can use npm as well. Just make sure to delete the
`yarn.lock` file before installing packages with npm.
2. The integration tests can be ran with `yarn test or npm run test` command.
3. `yarn start or npm run start` command starts the server. Once the server is started, you can query the graphql endpoints on `http://localhost:6900/graphql`
