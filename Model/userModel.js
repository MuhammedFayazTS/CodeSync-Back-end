const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
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
  },
},
{
  timestamps: true
});

const User = models.User || model("User", UserSchema);

module.exports = User;
