# 🙌 Contributing to **@rzl-zone**

Hi there! 🎉  
Thanks for considering contributing to **@rzl-zone** packages.

This repository is a **monorepo** containing multiple tools such as:

- `@rzl-zone/next-kit`
- `@rzl-zone/utils-js`
- `@rzl-zone/ts-types-plus`
- and more.

---

## 🛠 How to contribute?

We welcome all contributions, including:

- 🐛 Bug reports
- ✨ Feature requests
- 📝 Documentation improvements
- 🛠 Code improvements or new utility functions

---

## 🚀 Getting started

1. Fork the repository

    Click the [`Fork`](https://github.com/rzl-zone/rzl-zone/tree/dev) button at the top right of this repository page.

2. Clone your fork

    ```bash
    git clone https://github.com/YOUR-USERNAME/rzl-zone.git
    cd rzl-zone
    ```

3. Install dependencies

    ```bash
    pnpm install
    ```

4. Sync with the latest `dev` branch

    ```bash
    git checkout dev
    git pull origin dev
    ```

5. Create a new branch

    ```bash
    git checkout -b feature/my-awesome-feature
    ```

6. Choose a package to work on

    ```txt
    packages/
      ├─ next-kit
      ├─ utils-js
      ├─ ts-types-plus
    ```

    Example:

    ```bash
    cd packages/utils-js
    ```

7. Run development mode

    From the repository root:

    ```bash
    pnpm -F @rzl-zone/utils-js dev
    ```

    Or with Turbo:

    ```bash
    pnpm turbo run dev --filter=@rzl-zone/utils-js
    ```

8. Make your changes

    - Add tests if applicable
    - Follow existing patterns & conventions
    - Keep code clean and focused

9. Build & test your code

    ```bash
    pnpm -F @rzl-zone/utils-js build
    ```

10. Commit your changes

    ```bash
    git add .
    git commit -m "feat(utils-js): add awesome feature"
    ```

11. Push & open a Pull Request

    ```bash
    git push origin feature/my-awesome-feature
    ```

    Then open a Pull Request on GitHub 🎉

---

## 🌿 Branching strategy

Please create your Pull Request against the `dev` branch.

When opening a PR on GitHub, make sure:

- `base:` is `dev`
- `compare:` is your feature branch

Branch flow:

```txt
feature/* → dev → beta → main
```

---

## ✨ Code style

- Use TypeScript
- Follow the existing folder & file structure
- Keep functions small & focused
- Write meaningful scoped commit messages

Example:

```bash
feat(next-kit): add auth middleware helper
fix(utils-js): resolve deep merge issue
docs(ts-types-plus): improve README examples
```

---

## ✅ Before you submit

Make sure:

- The build passes
- No TypeScript errors
- No lint errors
- Your branch is up to date with `dev`
- Your PR targets the correct branch

---

## ❤️ Thank you

We appreciate your contribution.  
Whether it's a tiny typo fix or a new utility function — you're awesome! ✨  
*Made with ❤️ by **[@rzl-app](https://github.com/rzl-app).***
