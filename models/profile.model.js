const mongoose = require("mongoose");

//create profile schema

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },

  birthDay: {
    type: Date,
  },

  handle: {
    type: String,
    required: true,
  },

  company: {
    type: String,
  },

  bio: {
    type: String,
  },

  website: {
    type: String,
  },

  location: {
    type: String,
  },

  status: {
    type: String,
    required: true,
  },

  // skill is a list of strings
  skills: {
    type: [String],
    required: true,
  },

  githubUserName: {
    type: String,
  },

  experience: [
    {
      title: {
        type: String,
        required: true,
      },

      company: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      from: {
        type: Date,
        // required: true,
      },

      to: {
        type: Date,
      },

      current: {
        type: Boolean,
        default: false,
      },

      description: {
        type: String,
      },
    },
  ],

  education: [
    {
      School: {
        type: String,
        required: true,
      },

      degree: {
        type: String,
        required: true,
      },

      fieldOfStudy: {
        type: String,
        required: true,
      },

      from: {
        type: Date,
        required: true,
      },

      to: {
        type: Date,
      },

      current: {
        type: Boolean,
        default: false,
      },

      description: {
        type: String,
      },
    },
  ],

  social: {
    youtube: {
      type: String,
    },

    facebook: {
      type: String,
    },

    twitter: {
      type: String,
    },
  },

  //joined date
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
