# oslash_backend

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
