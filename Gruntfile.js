const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function exportGrunt(grunt) {
    grunt.initConfig({
        eslint: {
            target: [
                'tasks/**/*.js',
                'src/**/*.js',
                'Gruntfile.js',
            ],
        },

        sasslint: {
            target: [
                'src/**/*.scss',
            ],
        },

        webpack: {
            options: {
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    library: 'CustomFieldsHierarchy',
                    libraryTarget: 'umd',
                },
                module: {
                    rules: [
                        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
                    ],
                },
            },
            development: {
                entry: [
                    './lib/main.js',
                ],
                output: {
                    filename: 'bigcommerce-custom-fields-hierarchy.js',
                },
            },
            production: {
                entry: [
                    './lib/main.js',
                ],
                output: {
                    filename: 'bigcommerce-custom-fields-hierarchy.min.js',
                },
                plugins: [
                    new CleanWebpackPlugin(['dist']),
                    new UglifyJsPlugin(),
                ],
            },
        },
    });

    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['eslint', 'sasslint']);
};