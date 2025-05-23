import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,

});

const rulesConfig = {
  rules: {
    "@next/next/no-img-element": "off",
  },
};


const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  rulesConfig,
];

export default eslintConfig;
