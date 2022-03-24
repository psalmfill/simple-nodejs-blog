const Post = require("../database/models/Post");

const storePosts = (req, res) => {
  const { image } = req.files;
  image.mv(path.resolve(__dirname, "public/posts", image.name), (error) => {
    Post.create(
      {
        ...req.body,
        image: `/posts/${image.name}`,
      },
      (error, post) => {
        res.redirect("/");
      }
    );
  });
};
const createPost = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("create", { user: req.session.user });
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id.trim());
  res.render("post", { post });
};
module.exports = {
  storePosts,
  createPost,
  getPostById,
};
