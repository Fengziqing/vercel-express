const logger = require('./logger')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint


const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    next(error)
}

module.exports = {
    unknownEndpoint,
    errorHandler
}