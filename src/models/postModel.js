import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  author: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  },
  aiAnswer: { type: String },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      text: { type: String, required: true },
      avatar: { type: String },
      name: { type: String }
    },
  ],
  semester: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  upvotesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
},
{ timestamps: true }
);

const postModel = mongoose.models.posts || mongoose.model("posts", postSchema);

export default postModel;
