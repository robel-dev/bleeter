const express = require("express");
const passport = require("passport");
const router = express.Router();
const Post = require("../../models/post.model").Post;
const UserData = require("../../models/user.data.model");
const validatePostInput = require("../../validation/post.validation");
// @route   GET api/posts/test
// @desc    Tests posts route
// @access   public
router.get("/test", (req, res) => {
  res.json({ msg: "posts works" });
});

// @route   GET api/posts/
// @desc    fetch all the posts of all users
// @access   public
router.get("/", (req, res) => {
  const errors = {};
  Post.find()
    .sort({ date: -1 })
    .then((posts) => {
      if (!posts) {
        errors.noPosts = "No posts exist";
        return res.status(404).json(errors);
      }
      return res.json(posts);
    });
});

// @route   GET api/posts/:post_id
// @desc    fetch specified posts of USER
// @access   private
router.get(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Post.findOne({ _id: req.params.post_id }).then((post) => {
      if (!post) {
        errors.noPosts = "No posts exist";
        return res.status(404).json(errors);
      }
      return res.json(post);
    });
  }
);

// @route   GET api/posts/saved/all
// @desc    fetch all saved posts
// @access   private
router.get(
  "/saved/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    UserData.findOne({ userId: req.user.id }).then((userData) => {
      if (!userData) {
        return res.status(404).json({ msg: "No saved data." });
      } else if (userData.savedPosts.length == 0) {
        return res.json({ msg: "No saved posts." });
      }

      res.json(userData.savedPosts);
    });
  }
);

//add get all post of specific user(my bleets)
//---------------------here-----------------------------------------------------

// @route   POST api/posts/
// @desc    create a new post
// @access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    const post = new Post({
      //req.user ==> req.body
      userId: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar,
      text: req.body.text,
    });
    post.save().then((posts) => {
      res.json(posts);
    });
  }
);

// @route   POST api/posts/like/:post_id
// @desc    like a new post
// @access   private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id }).then((post) => {
      if (
        post.likes.filter((like) => like.userId.toString() === req.user.id)
          .length > 0
      ) {
        return res
          .status(400)
          .json({ msg: "User has already liked this post" });
      }

      //add user id to likes array
      post.likes.unshift({ userId: req.user.id });
      post.save().then((post) => res.json(post));
    });
  }
);

// @route   POST api/posts/comment/:post_id
// @desc    add a comment
// @access   private
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then((post) => {
        const newComment = {
          userId: req.user.id,
          text: req.body.text,
          name: req.user.name,
          avatar: req.user.avatar,
        };

        //add user id to likes array
        post.comments.unshift(newComment);
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/save/:post_id
// @desc    save a post
// @access   private
router.post(
  "/save/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id }).then((post) => {
      UserData.findOne({ userId: req.user.id }).then((userData) => {
        if (!userData) {
          const newUserData = new UserData({
            userId: req.user.id,
          });

          newUserData.savedPosts.unshift(post);
          newUserData.save().then((userData) => res.json(userData));
        } else {
          //check if post is saved
          if (
            userData.savedPosts.filter((post) => post._id == req.params.post_id)
              .length > 0
          ) {
            //user has already saved
            return res.status(400).json({ msg: "user has already saved post" });
          }

          userData.savedPosts.unshift(post);
          userData.save().then((userData) => res.json(userData));
        }
      });
    });
  }
);

// @route   delete api/posts/:id
// @desc    delete a post
// @access   private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        if (post.userId.toString() !== req.user.id) {
          return res.status(401).json({ msg: "not authorized" });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch((err) => res.status(404))
      .json({ postnotfound: "no posts found" });
  }
);
// @route   POST api/posts/unlike/:post_id
// @desc    Unlike post
// @access  Private
router.delete(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.userId.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map((item) => item.userId.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);
// @route   POST api/posts/remove-saved/:post_id
// @desc    remove saved post
// @access  Private
router.delete(
  "/remove-saved/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserData.findOne({ userId: req.user.id }).then((userData) => {
      if (
        userData.savedPosts.filter(
          (post) => post._id.toString() === req.params.post_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ commentnotexists: "saved post does not exist" });
      }
      const removeIndex = userData.savedPosts
        .map((post) => post._id.toString())
        .indexOf(req.params.post_id);
      userData.savedPosts.splice(removeIndex, 1);
      userData.save().then((userDadta) => {
        res.json(userData);
      });
    });
  }
);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);
module.exports = router;
