import { createPlugin } from "@markuplint/ml-core";

import { angularRule } from "./rules/angular-rule.js";

export default createPlugin({
  name: "markuplint-angular-rule",
  create(settings) {
    return {
      rules: {
        "angular-rule": angularRule(settings),
      },
    };
  },
});
