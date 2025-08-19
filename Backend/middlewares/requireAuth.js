const jwt = require('jsonwebtoken');
module.exports = function requireAuth(req,res,next)
{
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7):null;

  if(!token)
  {
    return res.status(401).json({error:'No token provided (use authorization : Bearer <token>)'})
  }

  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET);

    req.user = { id: payload.userId };
    next(); 
  }
  catch(err)
  {
    return res.status(401).json({error: 'invalid or expired token'});
  }
};