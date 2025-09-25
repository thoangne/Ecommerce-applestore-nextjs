/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "next/core-web-vitals", // rule chuẩn của Next.js
    "prettier", // nếu bạn dùng Prettier
  ],
  rules: {
    // Cho phép require trong file Prisma generated (bị báo lỗi no-require-imports)
    "@typescript-eslint/no-require-imports": "off",

    // Tắt rule unused-vars trong file auto-generated
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-require-imports": "off",
    // Với Next.js thì đôi khi có expression JSX chưa gọi hàm => disable
    "@typescript-eslint/no-unused-expressions": "off",

    // Optional: ép import có thứ tự
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],

    // React 17+ không cần import React trong file .tsx
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
