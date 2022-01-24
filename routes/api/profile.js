const express = require("express");
const passport = require("passport");
const User = require("../../models/user.model");
const Profile = require("../../models/profile.model");
const router = express.Router();
const mongoose = require("mongoose");

// Load Validation
const validateProfileInput = require("../../validation/profile.validation");
const validateExperienceInput = require("../../validation/experience.validation");
const validateEducationInput = require("../../validation/education.validation");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "profile works" });
});

// @route   GET api/profile
// @desc    get profile route
// @access  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate
    const errors = {};

    Profile.findOne({ userId: req.user.id })
      .populate("userId", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          console.log("no profile");
          errors.noProfile = "there is no profile";
          return res.status(404).res.json(errors);
        }
        console.log("empty profile");
        res.json(profile);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("userId", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   GET api/profile/:handle
// @desc    view people profile using their handle
// @access  public
router.get("/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("userId", ["name", "avatar"])
    .then((profile) => {
      if (!profile)
        return res.status(404).json({ handle: "user doesnt exist" });
      else {
        res.json(profile);
      }
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ userId: req.params.user_id })
    .populate("userId", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route   post api/profile
// @desc    post profile route
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate;
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.userId = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");

    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({ userId: req.user.id }).then((profile) => {
      //if proifle exists update
      if (profile) {
        Profile.findOneAndUpdate(
          { userId: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            res
              .status(400)
              .json({ msg: "User already exists with the same handle" });
          }
        });
        new Profile(profileFields).save().then((profile) => res.json(profile));
      }
    });
  }
);

// @route   post api/profile/experience
// @desc    add experience to profile
// @access  private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ userId: req.user.id }).then((profile) => {
      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.experience.unshift(newExperience);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route   post api/profile/education
// @desc    add education to profile
// @access  private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ userId: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);
// @route   delete api/profile/experience/:exp_id
// @desc    delete an experience
// @access  private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userId: req.user.id })
      .then((profile) => {
        //get index of the experience to be removed
        const expIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        //remove the experience of the given index
        profile.experience.splice(expIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   delete api/profile/education/:edu_id
// @desc    delete an education from profile
// @access  private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ userId: req.user.id })
      .then((profile) => {
        //get index of the experience to be removed
        const eduIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        //remove the experience of the given index
        profile.education.splice(eduIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   delete api/profile/
// @desc    delete user and profile
// @access  private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ userId: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
