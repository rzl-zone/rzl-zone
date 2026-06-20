## Click Feedback

A lightweight **React** component that provides visual feedback on user clicks.

Designed to enhance interaction clarity for buttons and interactive UI elements with smooth animated effects.

---

### Quick Start

  1. Installation

      ```bash
      # npm
      npm install @rzl-zone/click-feedback

      # pnpm
      pnpm add @rzl-zone/click-feedback

      # yarn
      yarn add @rzl-zone/click-feedback

      # bun
      bun add @rzl-zone/click-feedback
      ```

  2. Import the Styles (Required)

      Add this to your application's root or entry point (e.g., `main.tsx`, `_app.tsx`, or `layout.tsx`).  
      Without this CSS, the feedback animation will not render correctly.

      ```tsx
      // Import once in your root layout or entry file
      import "@rzl-zone/click-feedback/styles";
      ```

      *(Alternatively, you can also use `@import "@rzl-zone/click-feedback/styles";` inside your global CSS file).*

  3. Basic Usage

      Just drop the `<ClickFeedback />` component inside any supported interactive element (`<a>` or `<button>`).

      **Important:** Make sure the parent element has a `relative` position so the animation coordinates calculate correctly!

      ```tsx
      import { ClickFeedback } from "@rzl-zone/click-feedback";

      export default function App() {
        return (
          <button className="relative px-4 py-2 bg-blue-500 text-white rounded">
            Click me!
            <ClickFeedback />
          </button>
        );
      }
      ```

---

[Read More Documentation](https://rzlzone.vercel.app/docs/click-feedback)
