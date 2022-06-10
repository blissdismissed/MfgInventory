function protectAdminRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }

  if (req.path.startsWith('/') && !res.locals.isAdmin) {
    console.log("here I am");
    return res.redirect('/403');
  }

  next();
}

module.exports = protectAdminRoutes;
