import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
 id: { type: String, require: true },
 name: { type: String, require: true },
 username: { type: String, require: true, unique: true },
 image: String,
 bio: String,
 createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
 },
 members: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
 },
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

const Community = mongoose.models?.User || mongoose.model("Community", communitySchema);

export default Community;
