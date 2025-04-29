exports.requireLogin = (req, res, next) => {
    console.log('requireLogin - Session:', req.session);
    console.log('requireLogin - Session user:', req.session.user);
    if (req.session && req.session.user) {
      return next();
    } else {
      console.log('requireLogin - No user in session, redirecting to /login');
      return res.redirect('/login');
    }
  };
  