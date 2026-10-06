import {baseConfig} from "@language-learning/shared/config/eslint.base.js";

// The infrastructure imports no other package in the workspace: it names the Worker's entry file by path, and has it bundled
// and uploaded, which is not an import.
export default baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: []});
