import { createPlugin } from "@markuplint/ml-core";

import { controlFlowVisitor } from "./rules/index.js";

export default createPlugin({
  name: "markuplint-angular-control-flow-visitor",
  create(settings: any) {
    return {
      rules: {
        "control-flow-visitor": controlFlowVisitor(settings),
      },
    };
  },
});
