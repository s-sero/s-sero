const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@brand-primary': '#031858' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};