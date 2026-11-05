import pino from "pino"

const logger = pino({
    level: "info",
})

class Logger {
    info(msg, data) {
        if (data) {
            logger.info(data, msg);
        } else {
            logger.info(msg);
        }
    }

    error(msg, data) {
        if (data) {
            logger.error(data, msg);
        } else {
            logger.error(msg);
        }
    }

    warn(msg, data) {
        if (data) {
            logger.warn(data, msg);
        } else {
            logger.warn(msg);
        }
    }

    debug(msg, data) {
        if (data) {
            logger.debug(data, msg);
        } else {
            logger.debug(msg);
        }
    }
}

export default new Logger();