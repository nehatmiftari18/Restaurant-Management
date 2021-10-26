export default (roles) => (req, res, next) => {  
  if (roles.indexOf(req.user.role) >= 0){
    next();
  } else {
      res.status(403).json({"message": "Permission denied"});
  }
}