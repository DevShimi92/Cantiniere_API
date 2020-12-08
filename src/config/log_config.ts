import { configure, getLogger } from 'log4js';

configure({
    "appenders": {
      "everything": {
        "type": "file",
        "encoding": "utf-8",
        "filename": "logs/all-the-logs.log"
      },
      "emergencies": {
        "type": "file",
        "filename": "logs/error.log"
      },
      "just-errors": {
        "type": "logLevelFilter",
        "level": "error",
        "appender": "emergencies"
      },
      "console": {
        "type": "console",
        "category": "consoleshow",
        "layout": {
          "type": "pattern",
          "pattern": "%[[%d{dd-MM-yyyy hh:mm:ss.SSS}] [%p] %c -%] %m"
        }
      },
      "just-info": {
        "type": "logLevelFilter",
        "level": "trace",
        "appender": "console"
      }
    },
    "categories": {
      "default": { "appenders": [ "just-errors", "everything","just-info" ], "level": "trace" }
    }
  });


export const log = getLogger("API");