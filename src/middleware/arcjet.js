import aj from '../config/aj.js';

const arcjetMiddleWare = async (req, res, next) => {
  try {
    const decision = await aj.protect(req); 
    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) 
        return res.status(429).json({error: 'rate limit exceeded'});
      
      return res.status(403).json({error: 'access denied'});
    }
    next();
  } catch(err){
    console.log(`arcjet Middleware Error: ${err}`);
    next(err);
  }
}

export default arcjetMiddleWare;