module.exports = {
    moduleFileExtensions: ['js', 'json'],
    transform: {
        '^.+\\.(js)?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['<rootDir>/src/**/*.test.(js)'],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
};
