function errorsHandler(err, req, res, next) {
    let statusCode = res.statusCode || 500;
    let errorMessage = err.message || 'server threw an error'
    res.status(statusCode).json({type:'there is an error in the server',message:errorMessage})
}
export default errorsHandler;