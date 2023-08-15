import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 id: { type: String, require: true },
 name: { type: String, require: true },
 image: String,
 bio: String,
 username: { type: String, require: true, unique: true },
 threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
 onboarded: {
  type: Boolean,
  default: false,
 },
 communities: [
  {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Community",
  },
 ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
