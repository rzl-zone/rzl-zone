---
"@rzl-zone/build-tools": patch
---

Improve error handling and stack trace clarity in `runCommand` and `runCommandCapture`.

- Prevent unhandled promise rejections in certain async flows
- Normalize validation and process errors into a consistent async pattern
- Clean internal frames from stack traces for better developer experience
