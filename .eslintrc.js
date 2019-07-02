module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: ["vue"],
  root: true,
  // add your custom rules here
  rules: {
    "import/no-unresolved": 0,
    "import/no-unassigned-import": 0,
    semi: ["error", "never"],
    "vue/max-attributes-per-line": "off",
    "no-console": "off",
    "prettier/prettier": [
      "error",
      {
        semi: false
      }
    ]
  }
};
