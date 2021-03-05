module.exports = {
    coverageDirectory: 'coverage',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
            diagnostics: true,
        },
    },
    testEnvironment: "node",
    testURL: "http://domain.com/index.html",
    moduleFileExtensions: [
        'js',
        'ts',
        'tsx',
    ],
    preset: 'ts-jest',
    testMatch: [
        '**/src/__tests__/*Test.+(ts|tsx|js)',
    ],
}