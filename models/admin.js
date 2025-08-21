import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin"
  }
});

// Default behavior: collection name = "admins"
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);


// Agar tumne manually collection ka naam "admin" rakha hai
// const Admin = mongoose.model("Admin", adminSchema, "admin");
 

export default Admin;
