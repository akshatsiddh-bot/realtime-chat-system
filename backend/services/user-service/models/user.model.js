import  mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    authUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, 
        index: true
    },
     name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);