// it is a normal function named as wrap async which took another function (fn) as an argument, and this also returns another func abd that returned func took req,res,next as an argumentand this func execute the fn func with same parameter

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
