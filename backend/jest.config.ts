import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': [
            '@swc/jest',
            {
                jsc: {
                    parser: { syntax: 'typescript' },
                    target: 'es2021'
                },
                module: { type: 'es6' } // keep ESM
            }
        ]
    }
};

export default config;