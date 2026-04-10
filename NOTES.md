# 📝 Developer Notes

## ⚠️ Reminder: Modularize Your Python Main File

> **Every time you open this project, ask yourself:**
> _"Is my `main.py` clean and split into separate modules?"_

---

### What to do

Instead of putting **all logic in a single `main.py`**, separate each responsibility into its own file/module:

| Concern | Suggested file |
|---|---|
| Flask app setup & config | `app.py` |
| Route handlers | `routes.py` (or a `routes/` folder) |
| Database models | `models.py` |
| Business logic / helpers | `services.py` or `utils.py` |
| Constants / settings | `config.py` |

### Example structure

```
my_project/
├── main.py          # entry point only — just imports & app.run()
├── app.py           # creates the Flask app instance
├── config.py        # configuration values
├── routes.py        # all @app.route definitions
├── models.py        # database models
└── utils.py         # helper functions
```

### Why it matters

- **Readability** – smaller files are easier to understand at a glance.
- **Reusability** – functions in their own module can be imported anywhere.
- **Testability** – isolated modules are much easier to unit-test.
- **Collaboration** – teammates can work on different modules without conflicts.

---

_This note lives on the branch so it's always visible. Keep the code clean! 🚀_
