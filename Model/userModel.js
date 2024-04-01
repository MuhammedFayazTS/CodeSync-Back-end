const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema({
  googleId: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
    default:"https://img.icons8.com/fluency/96/guest-male--v1.png"
  },
},
{
  timestamps: true
});

const User = models.User || model("User", UserSchema);

module.exports = User;
