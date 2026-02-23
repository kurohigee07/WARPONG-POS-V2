const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
};

module.exports = errorHandler;
