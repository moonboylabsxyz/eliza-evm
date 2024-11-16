declare global {
    interface Buffer extends Uint8Array {}
}

declare module "fastembed" {
    export class FlagEmbedding {
        static init(options: { cacheDir: string }): Promise<FlagEmbedding>;
        queryEmbed(text: string): Promise<number[]>;
    }
}

declare module "unique-names-generator" {
    export interface Config {
        dictionaries: string[][];
        length?: number;
        separator?: string;
        style?: "capital" | "lowerCase" | "upperCase";
    }
    export const names: string[];
    export function uniqueNamesGenerator(config: Config): string;
}

export {};
