module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: "eslint:recommended",
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: { "prettier/prettier": "error" },
};
