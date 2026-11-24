const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true, sparse: true },
  username: { type: String, required: true, unique: true, sparse: true },
  password: { type: String, required: true },
  ref_no: { type: String, required: true,  },
  user_role: { 
    type: String, 
    required: true,
    default: 'FreeUser'
  },
  status: { type: String, default: "Pending" },
  UpdateStatus: { type: String,default: "not updated" },
  counter: { type: Number, default: 0 },
  last_loggedin: { type: String }, 
  loggedin_from: { type: String }, // IP address
  loggedin_platform: { type: String }, // "mobile", "desktop", etc.
  mobile_no: { type: String },
  refered_by: { type: String },
  refered_name: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: String },
  date_of_birth: { type: String },
  age: { type: Number },
  height: { type: String },
  marital_status: { type: String },
  profilefor: { type: String },
  email_id: { type: String },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  educational_qualification: { type: String },
  occupation: { type: String },
  income_per_month: { type: String },
  mother_tounge: { type: String },
  religion: { type: String },
  caste: { type: String },
  subcaste: { type: String },
  gotra: { type: String },
  rashi: { type: String },
  registration_no: { type: String },
  type_of_user: { type: String },
  image: { type: String },
  images: [{ type: String }],
  parents: [{
    relation: { type: String },
    name: { type: String }
  }],
  image_verification: { type: String, default: "pending" },
  secure_image: { type: String, default: "disable" },
  otherInfo: { type: String, default: "Pending" }
}, { timestamps: true, collection: "user_tbl", strict: false });

UserSchema.pre('save', function(next) {
  if (this.registration_no && !this.ref_no) this.ref_no = this.registration_no;
  if (this.ref_no && !this.registration_no) this.registration_no = this.ref_no;
  if (this.type_of_user && !this.user_role) this.user_role = this.type_of_user;
  if (this.user_role && !this.type_of_user) this.type_of_user = this.user_role;
  if (this.email_id && !this.username) this.username = this.email_id;
  if (this.username && !this.email_id) this.email_id = this.username;
  next();
});

const syncUserUpdateFields = function(next) {
  const update = this.getUpdate();
  if (!update) return next();
  const setObj = update.$set || update;
  if (setObj.user_role && !setObj.type_of_user) setObj.type_of_user = setObj.user_role;
  if (setObj.type_of_user && !setObj.user_role) setObj.user_role = setObj.type_of_user;
  if (setObj.registration_no && !setObj.ref_no) setObj.ref_no = setObj.registration_no;
  if (setObj.ref_no && !setObj.registration_no) setObj.registration_no = setObj.ref_no;
  if (setObj.email_id && !setObj.username) setObj.username = setObj.email_id;
  if (setObj.username && !setObj.email_id) setObj.email_id = setObj.username;
  next();
};

UserSchema.pre('findOneAndUpdate', syncUserUpdateFields);
UserSchema.pre('updateOne', syncUserUpdateFields);
UserSchema.pre('updateMany', syncUserUpdateFields);

UserSchema.index({ ref_no: 1 });
UserSchema.index({ registration_no: 1 });
UserSchema.index({ email_id: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ user_role: 1 });
UserSchema.index({ type_of_user: 1 });
UserSchema.index({ refered_by: 1 });
UserSchema.index({ refered_by: 1, status: 1 });
UserSchema.index({ image_verification: 1 });
UserSchema.index({ caste: 1 });
UserSchema.index({ gender: 1, age: 1 });

const UserModel = mongoose.model("user_tbl", UserSchema);
module.exports = UserModel;