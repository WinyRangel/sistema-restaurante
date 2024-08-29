const jwt = require('jsonwebtoken');

const obtenerDatosToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó un token' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'tu_secreto_jwt');
        req.usuarioId = decoded.usuarioId;
        req.carritoId = decoded.carritoId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

module.exports = obtenerDatosToken;
