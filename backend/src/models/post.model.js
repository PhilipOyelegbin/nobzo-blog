import { Schema, model } from "mongoose";
import slugify from "slugify";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [{ type: String }],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

postSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Post = model("Post", postSchema);
export { Post };
