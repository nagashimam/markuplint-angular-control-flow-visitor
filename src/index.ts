import { createPlugin } from "@markuplint/ml-core";
import type { Config } from "@markuplint/ml-config";

import { controlFlowVisitor } from "./rules/index.js";

export default createPlugin({
  name: "markuplint-angular-control-flow-visitor",
  create(settings: { config: Config }) {
    return {
      rules: {
        "control-flow-visitor": controlFlowVisitor(settings.config),
      },
    };
  },
});
