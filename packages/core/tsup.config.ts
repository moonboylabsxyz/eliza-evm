import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],
    noExternal: ["fastembed", "unique-names-generator"],
    external: [
        "@ai-sdk/*",
        "@anthropic-ai/sdk",
        "ai",
        "anthropic-vertex-ai",
        "gaxios",
        "glob",
        "js-sha1",
        "ollama-ai-provider",
        "openai",
        "tiktoken",
        "tinyld",
        "together-ai",
        "uuid",
        "fs",
        "path",
        "url"
    ],
    platform: 'node',
    target: 'node23',
    dts: true,
    treeshake: true,
    splitting: false,
    esbuildOptions(options) {
        options.conditions = ['import', 'node']
    }
});
