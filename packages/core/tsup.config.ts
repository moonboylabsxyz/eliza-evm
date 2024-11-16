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
        "uuid"
    ],
});
