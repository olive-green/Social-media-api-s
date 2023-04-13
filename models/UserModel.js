import { genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
      select: false,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, password: this.password },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const User = new model("User", UserSchema);
export default User;
