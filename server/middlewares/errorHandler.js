export default function errorHandler(err, req, res, next)
{
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(500).json({ error: err.message });
    }

    switch (err.name) {
        case 'NotFoundError':
            return res.status(404).json({ error: err.message });
        case 'ValidationError':
            return res.status(422).json({ error: err.message });
        case 'BadRequestError':
            return res.status(400).json({ error: err.message });
        case 'UnauthorizedError':
            return res.status(401).json({ error: 'Invalid Token' });
        case 'ForbiddenError':
            return res.status(403).json({ error: err.message });       
        default:
            return res.status(500).json({ error: err.message });
    }
}
