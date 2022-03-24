const aboutPage = (req, res) => {
  res.render("pages/about");
};

const postPage = (req, res) => {
  res.render("post");
};

const contactPage = (req, res) => {
  res.render("pages/contact");
};

module.exports = {
  aboutPage,
  postPage,
  contactPage,
};
