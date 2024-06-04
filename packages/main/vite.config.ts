import { UserConfigFn, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikVite } from "@builder.io/qwik/optimizer";

export default defineConfig(({ ssrBuild }) => {
  return {
    ssr: ssrBuild ? { target: "webworker", noExternal: true } : {},
    build: {
      emptyOutDir: !ssrBuild,
    },
    plugins: [qwikVite(), tsconfigPaths()],
  };
}) as UserConfigFn;
