const { Schema, model, models } =  require("mongoose");

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: [true, "Email already in exist"],
  },
  email: {
    type: String,
    unique: [true, "Email already in exist"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  image: {
    type: String,
  },
},
{
    timestamps:true
});

const User = models.User || model("User", UserSchema);

module.exports = User;