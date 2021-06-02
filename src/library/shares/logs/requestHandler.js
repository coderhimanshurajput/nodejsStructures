const _ = require('lodash');
require('colors');

class RequestHandler {
    constructor(logger) {
        this.logger = logger;
    }

    throwIf(fn, status, errorType, errorMessage) {
        return (result) =>
            fn(result) ? this.throwError(status, errorType, errorMessage)() : result;
    }

    validateJoi(err, status, errorType, errorMessage) {
        if (err) {
            this.logger.log(`error in validating request : ${errorMessage}`, 'warn');
        }
        return !_.isNull(err)
            ? this.throwError(status, errorType, errorMessage)()
            : '';
    }

    throwError(status, errorType, errorMessage) {
        return (e) => {
            if (!e) e = new Error(errorMessage || 'Default Error');
            e.status = status;
            e.errorType = errorType;
            throw e;
        };
    }

    catchError(res, error) {
        if (!error) error = new Error('Default error');
        res.status(error.status || 500).json({
            type: 'error',
            message: error.message || 'Unhandled error',
            error,
        });
    }

    sendSuccess(res, message, status) {
        this.logger.log(
            `a request has been made and proccessed successfully at:`.blue +
            `${new Date()}`.green,
            'info',
        );
        return (data, globalData) => {
            if (_.isUndefined(status)) {
                status = 200;
            }
            res.status(status).json({
                type: 'success',
                message: message || 'Success result',
                data,
                ...globalData,
            });
        };
    }

    sendError(req, res, error) {
        this.logger.log(
            `error ,Error during processing request: ${`${req.protocol}://${req.get(
                'host',
            )}${req.originalUrl}`} details message: ${error.message}`,
            'error',
        );
        return res.status(error.status || 400).json({
            type: 'error',
            status: 400,
            message: error,
            error: error.message || error.message || 'Unhandled Error'
        });
    }


    sendErrorWithStatus(req, res, status, error) {
        this.logger.log(
            `error ,Error during processing request: ${`${req.protocol}://${req.get(
                'host',
            )}${req.originalUrl}`} details message: ${error.message}`,
            'error',
        );
        return res.status(error.status || status).json({
            type: 'error',
            status: status,
            message: error.message || error.message || 'Unhandled Error',
            error,
        });
    }

    errorFormater = e =>{
        let errors =[];
        const allErrors = e.substring(e.indexOf(':')+1).trim()
        const allErrorsIn = allErrors.split(',').map(err => err.trim());
        allErrorsIn.forEach(error =>{
            const [key , val] = error.split(':').map(err => err.trim())
            errors[key] = val
        });
        return errors;
    }

}
module.exports = RequestHandler;
