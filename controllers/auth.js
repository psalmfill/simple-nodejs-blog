const User = require("../database/models/User");
const bcrypt = require("bcrypt");

const loginView = (req, res) => {
  res.render("login");
};

const login = (req, res) => {
  const { email, password } = req.body;
  // try to find the user
  User.findOne(
    {
      email,
    },
    (error, user) => {
      if (user) {
        // compare passwords.
        bcrypt.compare(password, user.password, (error, same) => {
          if (same) {
            // store user session.
            req.session.userId = user._id;
            req.session.user = user;
            res.redirect("/");
          } else {
            res.redirect("/auth/login");
          }
        });
      } else {
        return res.redirect("/auth/login");
      }
    }
  );
};

const registerView = (req, res) => {
  res.render("register", {
    errors: req.flash("registrationErrors"),
  });
};

const register = (req, res) => {
  console.log(req.body);
  User.create(req.body, (error, user) => {
    if (error) {
      const registrationErrors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );

      req.flash("registrationErrors", registrationErrors);
      return res.redirect("/auth/register");
    }
    res.redirect("/");
  });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  loginView,
  login,
  registerView,
  register,
  logout,
};
