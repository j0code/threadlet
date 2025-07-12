---
applyTo: '**'
---
Formatting rules:
  Always use tab characters for indentation (no spaces). If you encounter wrongly indented code, fix the indentation.
  Use "" for strings, not ''. Use template strings instead of concatenation.
  Use double equals (==), not triple equals (===) in TypeScript. If strict type checking is necessary, use other means of type checking.
  The same counts for inequality checking. Use !=, never !==.
  Omit semicolons at the end of lines.

Code Style rules:
  Adhere to modern coding standards (ESNext for JS/TS).
  Use ES Modules, never commonJS.
  Prefer async/await over callbacks for asynchronous code.
  Avoid using any. If the type of a variable is unknown, use type unknown.
  Prefer guard clauses over nested if/else.
  Avoid excessive comments. The code should describe itself.

Dependency rules:
  Do not use any frameworks like React, Vue, etc.
  Avoid unnecessary dependencies.
