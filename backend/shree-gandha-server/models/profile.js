const mongoose = require('mongoose');

// Add these indexes to your Profile schema
const ProfileSchema = new mongoose.Schema({
  registration_no: { type: String, required: true, unique: true, sparse: true },
  registration_date: String,
  expiry_date: String,
  marital_status: String,
  first_name: String,
  last_name: String,
  full_name: String,
  fullname: String,
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
  mobile_numbers: [String],
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
  refered_name: String,
  skin_type: String,
  body_type: String,
  diet: String,
  drink: String,
  smoke: String,
  sunsign: String,
  bloodgroup: String,
  mobile_verification: String,
  image: String,
  parents: [{
    relation: String,
    name: String,
    contact: String,
    mobile_no: String
  }],
  father_contact: String,
  mother_contact: String,
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
  otherInfo: String,
}, { collection: 'user_tbl' }); 

// Pre-save hook to ensure aliases are always synchronized
ProfileSchema.pre('save', function(next) {
  if (this.registration_no && !this.ref_no) this.ref_no = this.registration_no;
  if (this.ref_no && !this.registration_no) this.registration_no = this.ref_no;
  if (this.type_of_user && !this.user_role) this.user_role = this.type_of_user;
  if (this.user_role && !this.type_of_user) this.type_of_user = this.user_role;
  if (this.email_id && !this.username) this.username = this.email_id;
  if (this.username && !this.email_id) this.email_id = this.username;

  // Split full_name into first_name and last_name, keep full_name & fullname
  const nameToSplit = this.full_name || this.fullname;
  if (nameToSplit && typeof nameToSplit === 'string') {
    const parts = nameToSplit.trim().split(/\s+/);
    if (!this.first_name) this.first_name = parts[0] || '';
    if (!this.last_name) this.last_name = parts.slice(1).join(' ') || '';
    if (!this.full_name) this.full_name = nameToSplit.trim();
    if (!this.fullname) this.fullname = nameToSplit.trim();
  } else if (this.first_name || this.last_name) {
    const combined = `${this.first_name || ''} ${this.last_name || ''}`.trim();
    if (!this.full_name) this.full_name = combined;
    if (!this.fullname) this.fullname = combined;
  }

  // Handle multiple mobile numbers synchronization
  if (Array.isArray(this.mobile_numbers) && this.mobile_numbers.length > 0) {
    if (!this.mobile_no) this.mobile_no = this.mobile_numbers[0];
  } else if (this.mobile_no) {
    this.mobile_numbers = [this.mobile_no];
  }

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

  const nameToSplit = setObj.full_name || setObj.fullname;
  if (nameToSplit && typeof nameToSplit === 'string') {
    const parts = nameToSplit.trim().split(/\s+/);
    if (!setObj.first_name) setObj.first_name = parts[0] || '';
    if (!setObj.last_name) setObj.last_name = parts.slice(1).join(' ') || '';
    setObj.full_name = nameToSplit.trim();
    setObj.fullname = nameToSplit.trim();
  } else if (setObj.first_name || setObj.last_name) {
    const combined = `${setObj.first_name || ''} ${setObj.last_name || ''}`.trim();
    if (!setObj.full_name) setObj.full_name = combined;
    if (!setObj.fullname) setObj.fullname = combined;
  }

  if (Array.isArray(setObj.mobile_numbers) && setObj.mobile_numbers.length > 0) {
    if (!setObj.mobile_no) setObj.mobile_no = setObj.mobile_numbers[0];
  } else if (setObj.mobile_no && !setObj.mobile_numbers) {
    setObj.mobile_numbers = [setObj.mobile_no];
  }

  next();
};

ProfileSchema.pre('findOneAndUpdate', syncProfileUpdateFields);
ProfileSchema.pre('updateOne', syncProfileUpdateFields);
ProfileSchema.pre('updateMany', syncProfileUpdateFields); 

// Add compound indexes for commonly queried fields
ProfileSchema.index({ registration_no: 1, gender: 1 });
ProfileSchema.index({ age: 1 });
ProfileSchema.index({ height: 1 });
ProfileSchema.index({ caste: 1 });

module.exports = mongoose.model('Profile', ProfileSchema);