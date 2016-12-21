import environment from './environment';
import 'bootstrap';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-ui-virtualization')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 5;
      config.settings.position = (modalContainer, modalOverlay) => {
        console.log(modalContainer);
        console.log(modalOverlay);
      };
    });
    // .plugin('aurelia-ux')

  aurelia.use.plugin('aurelia-animator-css')

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start()
    .then(() => aurelia.setRoot())
    .catch(err => {
      console.error(err);
    });
}
