import { WebpackOverrideFn } from "@remotion/cli/config";
import { CompileOptions } from '@mdx-js/mdx'

export const enableMdx: WebpackOverrideFn = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []),
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: "@mdx-js/loader",
              /** @type {import('@mdx-js/mdx').CompileOptions} */
              options: {
                outputFormat: 'program',
                jsx: false,
              } satisfies CompileOptions,
            },
          ],
        },
      ],
    },
  };
};