import {baseConfig} from "@language-learning/shared/config/eslint.base.js";

// The tools sit above `content` and `shared` and below nothing: no other package imports them.
export default baseConfig({
  tsconfigRootDir: import.meta.dirname,
  allowedPackages: ["@language-learning/shared", "@language-learning/content"],
});
