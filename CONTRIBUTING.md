# 🙌 Contributing to **@rzl-zone**

Hi there! 🎉  
Thanks for considering contributing to **@rzl-zone** packages. 🚀  
This repository is a **monorepo** containing multiple tools such as:

- `@rzl-zone/next-kit`
- `@rzl-zone/utils-js`
- `@rzl-zone/ts-types-plus`
- and more

---

## 🛠 How to contribute?

We welcome all contributions, including:

- 🐛 Bug reports.
- ✨ Feature requests.
- 📝 Improving documentation.
- 🛠 Code improvements or new utility functions.

---

## 🚀 Getting started.

1.  **Fork the repository**

    ###### Click on the `Fork` button at the top right of this repo page.

2.  **Clone your fork**

    ```bash
    git clone https://github.com/YOUR-USERNAME/rzl-zone.git
    cd rzl-zone
    ```

3.  **Install dependencies**
    ```bash
    pnpm install
    ```
4.  **Choose a package to work on**

    ```txt
    packages/
      ├─ next-kit
      ├─ utils-js
      ├─ ts-types-plus

    ```

    **Example:**

    ```bash
    cd packages/next-kit
    ```

5.  **Run dev mode (filtered)**
    **From the repo root:**
    ```bash
    pnpm -F @rzl-zone/next-kit dev
    ```
    **or with Turbo:**
    ```bash
    pnpm turbo run dev --filter=@rzl-zone/next-kit
    ```
6.  **Create a new branch**
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
7.  **Make your changes, add tests if needed.**
    - Add tests if applicable
    - Follow existing patterns & conventions
8.  **Build & test your code**
    ```bash
    pnpm -F @rzl-zone/next-kit build
    ```
9.  **Commit your changes**
    ```bash
    git add .
    git commit -m "feat(next-kit): add awesome feature"
    ```
10. **Push & open a Pull Request**

    ```bash
    git push origin feature/my-awesome-feature
    ```

    **Then open a PR on GitHub 🎉**

---

## ✨ Code style.

- Use TypeScript.
- Follow existing folder & file structure.
- Keep functions small & focused.
- Write meaningful, scoped commit messages.

---

## ✅ Before you submit.

- Ensure the build passes.
- No TypeScript or lint errors.
- PR targets the correct change.

---

## ❤️ Thank you.

We appreciate your contribution.  
Whether it's a tiny typo fix or a new utility function — you're awesome! ✨  
\*Made with ❤️ **[@rzl-app](https://github.com/rzl-app).\***
