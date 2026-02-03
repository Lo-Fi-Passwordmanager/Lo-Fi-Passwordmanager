import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        execArgv: [
            '--localstorage-file',
            path.resolve(os.tmpdir(), `vitest-${process.pid}.localstorage`),
        ],
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});