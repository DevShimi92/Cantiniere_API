import { sequelize } from "../config/database";
import { log } from "../config/log_config";

before(function() {
/*
    log.info('Preparation of the test base');

    sequelize.sync().then(() => {
      log.info('Synchronisation de la base réussi !');
      done();
      }).catch(err => {
      log.error('Erreur lors de la synchronisation de la base de donnée !');
      log.error(err);
      done();
    });
*/
  });
