import {defineConfig} from 'cypress'
import {addCucumberPreprocessorPlugin} from "@badeball/cypress-cucumber-preprocessor";
import browserify from "@badeball/cypress-cucumber-preprocessor/browserify";
export default defineConfig({
    fixturesFolder: 'lib/env/fixtures',
    screenshotsFolder: 'reports/ui/screenshots',
    videosFolder: 'reports/ui/videos',
    watchForFileChanges: false,
    viewportWidth: 1300,
    viewportHeight: 800,
    chromeWebSecurity: false,
    defaultCommandTimeout: 60000,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'reports/ui', 
        overwrite: false,
        html: false,
        json: true,
    },
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        async setupNodeEvents(
            on: Cypress.PluginEvents,
            config: Cypress.PluginConfigOptions
        ): Promise<Cypress.PluginConfigOptions> {
            // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
            await addCucumberPreprocessorPlugin(on, config);

            on(
                "file:preprocessor",
                browserify(config, {
                    typescript: require.resolve("typescript"),
                })
            );

            // Make sure to return the config object as it might have been modified by the plugin.
            return config;


        },
        specPattern: 'ui/**/*.{feature,features}',
        supportFile: 'ui/support/index.js',

    },
    env: {
        "MAILDEV_PROTOCOL": "https",
        "MAILDEV_HOST": "staging-maildev.salucro-staging.net",
        "EMAIL_PORT": 25,
        "doCaptureLitleRequest": "/xadmin/master/DoCaptureLitle.php?tx_id=",
        "runRecurringJobRequest": "/xadmin/master/recurring/run-recurring-job.php",

    }
})
