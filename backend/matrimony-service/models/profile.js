const mongoose = require('mongoose');

// Add these indexes to your Profile schema
const ProfileSchema = new mongoose.Schema({
  registration_no: { type: String, required: true, unique: true },
  registration_date: String,
  expiry_date: String,
  marital_status: String,
  first_name: String,
  last_name: String,
  gender: String,
  date_of_birth: String,
  age: Number,
  height: String,
  name_of_parent: String,
  address: String,
  country: String,
  state: String,
  city: String,
  pincode: String,
  mobile_no: String,
  email_id: String,
  educational_qualification: String,
  occupation: String,
  income_per_month: String,
  mother_tounge: String,
  religion: String,
  caste: String,
  gotra: String,
  rashi: String,
  from_age_preference: Number,
  to_age_preference: Number,
  from_height_preference: String,
  to_height_preference: String,
  education_preference: String,
  caste_preference: String,
  any_other_info: String,
  terms_conditions_status: String,
  status: String,
  type_of_user: String,
  profilefor: String,
  likes: String,
  current_status: String,
  refered_by: String,
  skin_type: String,
  body_type: String,
  diet: String,
  drink: String,
  smoke: String,
  sunsign: String,
  bloodgroup: String,
  mobile_verification: String,
  image: String,
  images: [String],
  parents: [{
    relation: String,
    name: String
  }],
  image_verification: { type: String,default: "pending" },
  secure_image: {type: String, 
    enum: ['disable', 'enable', 'Premiumuser', 'requestuser'], 
    default: 'disable'},
  subcaste: String,
  brother_younger_unmarried: String,
  brother_younger_married: String,
  brother_elder_unmarried: String,
  brother_elder_married: String,
  sister_younger_unmarried: String,
  sister_younger_married: String,
  sister_elder_unmarried: String,
  sister_elder_married: String,
  occupation_country: String,
  occupation_country_preference: String,
  maritalstatus_preference: String,
  contactinfo: String,
  assistance: String,
  nakshatra: String,
  boost_profile: String,
  boosted_on: String,
  otherInfo: { type: String, default: 'Pending' },
  ref_no: String,
  user_id: Number,
  username: String,
  password: String,
  user_role: String,
}, { collection: 'user_tbl', timestamps: true, strict: false }); 

// Pre-save hook to ensure aliases are always synchronized
ProfileSchema.pre('save', function(next) {
  if (this.registration_no && !this.ref_no) this.ref_no = this.registration_no;
  if (this.ref_no && !this.registration_no) this.registration_no = this.ref_no;
  if (this.type_of_user && !this.user_role) this.user_role = this.type_of_user;
  if (this.user_role && !this.type_of_user) this.type_of_user = this.user_role;
  if (this.email_id && !this.username) this.username = this.email_id;
  if (this.username && !this.email_id) this.email_id = this.username;
  next();
});

const syncProfileUpdateFields = function(next) {
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

ProfileSchema.pre('findOneAndUpdate', syncProfileUpdateFields);
ProfileSchema.pre('updateOne', syncProfileUpdateFields);
ProfileSchema.pre('updateMany', syncProfileUpdateFields);

// Compound and single-field indexes for high-performance querying
ProfileSchema.index({ ref_no: 1 });
ProfileSchema.index({ email_id: 1 });
ProfileSchema.index({ mobile_no: 1 });
ProfileSchema.index({ status: 1 });
ProfileSchema.index({ user_role: 1 });
ProfileSchema.index({ type_of_user: 1 });
ProfileSchema.index({ refered_by: 1 });
ProfileSchema.index({ caste: 1 });
ProfileSchema.index({ gender: 1, age: 1 });
ProfileSchema.index({ registration_no: 1, gender: 1 });
ProfileSchema.index({ age: 1 });
ProfileSchema.index({ height: 1 });

module.exports = mongoose.model('Profile', ProfileSchema);