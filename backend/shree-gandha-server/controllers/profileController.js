const Profile = require("../models/profile");
const UserModel = require("../models/user");
const TransactionModel = require("../models/Transactions/OnlineTransaction");
const { blurAndGetURL } = require("../utils/ImageBlur");
const { processUserImages } = require("../utils/SecureImageHandler");
const BlurredImages = require("../models/blurredImages");
const { getPaginationParams } = require("../utils/pagination");
const { getActiveMessage, getDeactiveMessage, getImageVerifiedMessage } = require("../utils/EmailMessages");
const { sendMail } = require("../utils/EmailService");
const { creditPromoterOnAdminAction } = require("./payment.controller");

// Get profile by registration number
const getProfileByRegistrationNo = async (req, res) => {
  try {
    const { registration_no } = req.params;

    const user = await UserModel.findOne({
      $or: [{ registration_no }, { ref_no: registration_no }]
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found with the given registration number",
      });
    }

    const regNo = user.registration_no || user.ref_no || registration_no;
    const profileObj = {
      ...user,
      registration_no: regNo,
      ref_no: regNo,
      type_of_user: user.type_of_user || user.user_role || "FreeUser",
      user_role: user.user_role || user.type_of_user || "FreeUser",
    };

    if (!profileObj.full_name) {
      const calculatedFullName = `${profileObj.first_name || ""} ${profileObj.last_name || ""}`.trim();
      profileObj.full_name = calculatedFullName;
      profileObj.fullname = calculatedFullName;
    }
    if (!profileObj.mobile_numbers || profileObj.mobile_numbers.length === 0) {
      if (profileObj.mobile_no) {
        profileObj.mobile_numbers = [profileObj.mobile_no];
      }
    }

    res.status(200).json({
      success: true,
      data: profileObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const DeleteImage = async (req, res) => {
  try {
    const { registration_no } = req.params;
    if (!registration_no) {
      return res.status(404).json({
        success: false,
        message: "Registration number is required",
      });
    }

    const filter = {
      $or: [{ registration_no }, { ref_no: registration_no }]
    };
    const profile = await UserModel.findOne(filter);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (!profile.image || profile.image === "") {
      return res.status(400).json({
        success: false,
        message: "No image found to delete for this profile",
      });
    }

    profile.image = "";
    profile.image_verification = "pending"; // Reset image verification status
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { registration_no } = req.params;
    const { _id, image, status, isProfileUpdate, ...others } = req.body;

    if (others.full_name || others.fullname) {
      const rawFn = (others.full_name || others.fullname).trim();
      const parts = rawFn.split(/\s+/);
      others.first_name = parts[0] || "";
      others.last_name = parts.slice(1).join(" ") || "";
      others.full_name = rawFn;
      others.fullname = rawFn;
    } else if (others.first_name || others.last_name) {
      const combined = `${others.first_name || ""} ${others.last_name || ""}`.trim();
      others.full_name = combined;
      others.fullname = combined;
    }

    if (others.mobile_numbers && Array.isArray(others.mobile_numbers)) {
      const validNumbers = others.mobile_numbers.map(n => String(n).trim()).filter(Boolean);
      others.mobile_numbers = validNumbers;
      if (!others.mobile_no && validNumbers.length > 0) {
        others.mobile_no = validNumbers[0];
      }
    } else if (others.mobile_no && !others.mobile_numbers) {
      others.mobile_numbers = [String(others.mobile_no).trim()];
    }

    if (Array.isArray(others.parents)) {
      others.parents = others.parents.map(p => {
        if (!p) return p;
        const rel = (p.relation || "").toLowerCase();
        let contact = p.contact || p.mobile_no || "";
        if (!contact && rel.includes("father") && others.father_contact) {
          contact = others.father_contact;
        }
        if (!contact && rel.includes("mother") && others.mother_contact) {
          contact = others.mother_contact;
        }
        return {
          ...p,
          contact: contact || undefined,
          mobile_no: contact || undefined
        };
      });
    }

    const filter = {
      $or: [{ registration_no }, { ref_no: registration_no }]
    };

    const oldProfile = await UserModel.findOne(filter);
    if (!oldProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found with the given registration number",
      });
    }

    const oldImageVerification = oldProfile.image_verification;

    // Build unified update object for user_tbl
    const updateObj = { ...others };
    if (image) updateObj.image = image;
    if (typeof status !== 'undefined') updateObj.status = status;

    const targetRole = others.user_role || others.type_of_user;
    if (targetRole) {
      updateObj.type_of_user = targetRole;
      updateObj.user_role = targetRole;
    }

    // Check profile completeness for otherInfo status
    const requiredFields = ['height', 'pincode', 'gotra', 'rashi', 'nakshatra', 'subcaste', 'bloodgroup', 'skin_type', 'body_type', 'diet', 'drink', 'smoke', 'sunsign', 'brother_younger_unmarried', 'brother_younger_married', 'brother_elder_unmarried', 'brother_elder_married', 'sister_younger_unmarried', 'sister_younger_married', 'sister_elder_unmarried', 'sister_elder_married', 'from_age_preference', 'to_age_preference', 'from_height_preference', 'to_height_preference', 'education_preference', 'caste_preference', 'maritalstatus_preference', 'occupation_country_preference', 'contactinfo', 'any_other_info'];
    const mergedData = { ...(oldProfile.toObject ? oldProfile.toObject() : oldProfile), ...others };
    if (requiredFields.every(f => String(mergedData[f] ?? '').trim())) updateObj.otherInfo = 'Complete';

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      { $set: updateObj },
      { new: true }
    );

    if (updatedUser) {
      try {
        if (
          typeof oldImageVerification !== 'undefined' &&
          oldImageVerification === 'pending' &&
          updatedUser.image_verification === 'active'
        ) {
          const { imageVerifiedMessage, imageVerifiedSubject } = getImageVerifiedMessage(updatedUser);
          await sendMail(updatedUser.email_id || updatedUser.username, imageVerifiedSubject, imageVerifiedMessage);
        }

        if (
          status &&
          oldProfile.status &&
          oldProfile.status !== status
        ) {
          let subject, message;

          if (isProfileUpdate === true) {
            const { activatedSubject, activatedMessage } = getActiveMessage(updatedUser);
            if (!activatedSubject || !activatedMessage) {
              throw new Error("Activation email content is missing!");
            }
            subject = activatedSubject;
            message = activatedMessage;
          } else if (isProfileUpdate === false) {
            const { deactivatedSubject, deactivatedMessage } = getDeactiveMessage(updatedUser);
            subject = deactivatedSubject;
            message = deactivatedMessage;
          }

          if (subject && message) {
            await sendMail(updatedUser.email_id || updatedUser.username, subject, message);
          }
        }
      } catch (error) {
        console.error(error.message);
      }

      if (
        updatedUser.status?.toLowerCase() === "active" ||
        updatedUser.image_verification?.toLowerCase() === "active" ||
        status?.toLowerCase() === "active" ||
        req.body.status?.toLowerCase() === "active"
      ) {
        console.log("=== [CONSLODE LOG: UPDATE PROFILE ACTIVATION] Admin activated user:", updatedUser.registration_no || updatedUser.ref_no, ". Triggering creditPromoterOnAdminAction ===");
        await creditPromoterOnAdminAction(updatedUser, Date.now().toString(), updatedUser.type_of_user);
      }
    }

    if (image) {
      const blurredUrl = await blurAndGetURL(image, updatedUser.registration_no || updatedUser.ref_no || registration_no);
      await BlurredImages.findOneAndUpdate(
        { user_id: updatedUser.registration_no || updatedUser.ref_no || registration_no },
        { $set: { blurredImage: blurredUrl } },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: { profile: updatedUser, user: updatedUser },
      message: "Profile Updated Successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUserDetails = async (req, res) => {
  try {
    const { user_role: userRole, ref_no: loggedInUserId } = req.user;
    const { page, pageSize } = getPaginationParams(req);

    const matchFilter = { ref_no: { $ne: loggedInUserId } };

    // Direct aggregation on unified user_tbl (no cross-table $lookup needed)
    const [{ metadata, data }] = await UserModel.aggregate([
      {
        $facet: {
          metadata: [
            { $match: matchFilter },
            { $count: "totalRecords" }
          ],
          data: [
            { $match: matchFilter },
            {
              $addFields: {
                full_name: {
                  $cond: [
                    { $and: ["$full_name", { $ne: ["$full_name", ""] }] },
                    "$full_name",
                    {
                      $trim: {
                        input: {
                          $concat: [
                            { $ifNull: ["$first_name", ""] },
                            " ",
                            { $ifNull: ["$last_name", ""] }
                          ]
                        }
                      }
                    }
                  ]
                },
                mobile_no: {
                  $cond: [
                    { $eq: [userRole, "FreeUser"] },
                    null,
                    "$mobile_no"
                  ]
                },
                email_id: {
                  $cond: [
                    { $eq: [userRole, "FreeUser"] },
                    null,
                    "$email_id"
                  ]
                },
                // Add sorting priority for type_of_user
                type_priority: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$type_of_user", "PremiumUser"] }, then: 1 },
                      { case: { $eq: ["$type_of_user", "SilverUser"] }, then: 2 },
                      { case: { $eq: ["$type_of_user", "FreeUser"] }, then: 3 }
                    ],
                    default: 4
                  }
                },
                // Parse registration_date as date for proper sorting
                registration_date_parsed: {
                  $dateFromString: {
                    dateString: "$registration_date",
                    format: "%m/%d/%Y",
                    onError: new Date(0),
                    onNull: new Date(0)
                  }
                }
              }
            },
            // Sort by latest registration and creation timestamp (recent first)
            { $sort: { registration_date_parsed: -1, _id: -1 } },
            {
              $project: {
                ...(userRole?.toLowerCase() !== "admin" && { password: 0 }),
                registration_date_parsed: 0,
                type_priority: 0,
                __v: 0
              }
            },
            { $skip: page * pageSize },
            { $limit: pageSize }
          ]
        }
      }
    ]).exec();

    const userDetails = await processUserImages(
      data,
      loggedInUserId,
      userRole
    );

    return res.status(200).json({
      success: true,
      content: userDetails,
      currentPage: page,
      pageSize,
      totalRecords: metadata?.[0]?.totalRecords || 0
    });

  } catch (error) {
    console.error("getAllUserDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};

const getProfilesRenewal = async (req, res) => {
  try {
    const { page = 0, pageSize = 50, search } = req.query;
    const skip = parseInt(page) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    let filterConditions = {
      user_role: { $ne: "admin" },
      $or: [
        { status: "Pending" },
        { status: "pending" },
        { status: "inactive" },
        { status: "expires" },
        { expiry_date: { $lt: new Date() } },
      ],
    };

    if (search) {
      filterConditions.$and = [
        {
          $or: [
            { registration_no: { $regex: search, $options: "i" } },
            { ref_no: { $regex: search, $options: "i" } },
            { first_name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { email_id: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const [total, users] = await Promise.all([
      UserModel.countDocuments(filterConditions),
      UserModel.aggregate([
        { $match: filterConditions },
        {
          $project: {
            username: 1,  
            user_role: 1,
            status: 1,
            registration_no: { $ifNull: ["$registration_no", "$ref_no"] },
            ref_no: { $ifNull: ["$ref_no", "$registration_no"] },
            first_name: 1,
            email_id: { $ifNull: ["$email_id", "$username"] },
            gender: 1,
            expiry_date: 1,
            mobile_no: 1,
            plan_type: { $ifNull: ["$plan_type", "$type_of_user", "$user_role"] },
            created_at: { $ifNull: ["$created_at", "$createdAt", "$registration_date"] },
          },
        },
        { $sort: { expiry_date: 1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const currentDate = new Date();
    const processedUsers = users.map((user) => {
      const isExpired = new Date(user.expiry_date) < currentDate;
      const daysUntilExpiry = !isExpired
        ? Math.ceil(
            (new Date(user.expiry_date) - currentDate) / (1000 * 60 * 60 * 24)
          )
        : 0;

      let finalStatus = isExpired ? "expired" : user.status?.toLowerCase();

      return {
        ...user,
        status: finalStatus,
        days_until_expiry: daysUntilExpiry,
        expiry_message: isExpired
          ? `Account expired on ${new Date(user.expiry_date).toLocaleDateString()}`
          : `Account expires in ${daysUntilExpiry} days`,
        can_renew: true,
        renewal_eligible: !["banned", "suspended"].includes(finalStatus),
      };
    });

    res.json({
      success: true,
      content: processedUsers,
      currentPage: parseInt(page),
      pageSize: limit,
      totalRecords: total,
    });
  } catch (error) {
    console.error("Renewal profiles API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch renewal profiles",
    });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const userRegNo = req.user.ref_no;
    const userRole = req.user.user_role;
    const { page = 0, pageSize = 10 } = getPaginationParams(req);

    const myProfile = await UserModel.findOne({
      $or: [{ registration_no: userRegNo }, { ref_no: userRegNo }]
    }).lean();

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for current user."
      });
    }

    // Build match criteria directly on user_tbl
    const matchCriteria = {
      $and: [
        { registration_no: { $ne: userRegNo } },
        { ref_no: { $ne: userRegNo } },
        { status: "active" }
      ]
    };

    // Gender filter
    if (myProfile.gender) {
      const genderMap = {
        bride: "bridegroom",
        bridegroom: "bride",
        male: "female",
        female: "male"
      };
      const oppositeGender = genderMap[myProfile.gender.toLowerCase()];
      if (oppositeGender) {
        matchCriteria.gender = new RegExp(`^${oppositeGender}$`, "i");
      }
    }

    // Age filter
    if (myProfile.from_age_preference && myProfile.to_age_preference) {
      matchCriteria.age = {
        $gte: parseInt(myProfile.from_age_preference),
        $lte: parseInt(myProfile.to_age_preference)
      };
    }

    // Height filter
    if (myProfile.from_height_preference && myProfile.to_height_preference) {
      const extractCm = (heightStr) => {
        const match = heightStr.match(/(\d+)cm/);
        return match ? parseInt(match[1]) : null;
      };

      const fromCm = extractCm(myProfile.from_height_preference);
      const toCm = extractCm(myProfile.to_height_preference);

      if (fromCm && toCm) {
        matchCriteria.height = {
          $regex: new RegExp(`(${fromCm}|${toCm})cm`)
        };
      }
    }

    // Caste filter
    if (
      myProfile.caste_preference &&
      !myProfile.caste_preference.toLowerCase().includes("any")
    ) {
      matchCriteria.caste = myProfile.caste_preference;
    }

    const [totalRecords, matches] = await Promise.all([
      UserModel.countDocuments(matchCriteria),
      UserModel.aggregate([
        { $match: matchCriteria },
        {
          $addFields: {
            user_details: {
              user_role: { $ifNull: ["$user_role", "$type_of_user", "FreeUser"] },
              status: "$status",
              UpdateStatus: "$UpdateStatus",
              counter: "$counter",
              last_loggedin: "$last_loggedin",
              ref_no: { $ifNull: ["$ref_no", "$registration_no"] }
            },
            mobile_no: {
              $cond: [
                { $eq: [req.user.user_role, "FreeUser"] },
                null,
                "$mobile_no"
              ]
            },
            email_id: {
              $cond: [
                { $eq: [req.user.user_role, "FreeUser"] },
                null,
                { $ifNull: ["$email_id", "$username"] }
              ]
            },
            // Add priority for sorting
            type_priority: {
              $switch: {
                branches: [
                  { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /premium/i } }, then: 1 },
                  { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /silver/i } }, then: 2 },
                  { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /free/i } }, then: 3 }
                ],
                default: 4
              }
            },
            // Convert registration_date to Date for proper sorting
            registration_date_parsed: {
              $dateFromString: {
                dateString: "$registration_date",
                format: "%m/%d/%Y",
                onError: new Date(0),
                onNull: new Date(0)
              }
            }
          }
        },
        {
          $project: {
            ...(userRole?.toLowerCase() !== "admin" && { password: 0 }),
            __v: 0
          }
        },
        // Sort by user type first, then by latest registration
        { $sort: { type_priority: 1, registration_date_parsed: -1, _id: -1 } },
        { $skip: page * pageSize },
        { $limit: pageSize }
      ]).exec()
    ]);

    const processedMatches = await processUserImages(
      matches,
      userRegNo,
      req.user.user_role
    );

    return res.status(200).json({
      success: true,
      content: processedMatches,
      currentPage: page,
      pageSize,
      totalRecords,
      appliedFilters: {
        preferences: {
          age: {
            from: myProfile?.from_age_preference,
            to: myProfile?.to_age_preference
          },
          height: {
            from: myProfile?.from_height_preference,
            to: myProfile?.to_height_preference
          },
          caste: myProfile?.caste_preference,
          education: myProfile?.education_preference
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching matches",
      error: error.message
    });
  }
};

const searchUsersByInput = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search input is required",
      });
    }

    const cleanedInput = input.trim().replace(/^["']+|["']+$/g, "");
    const words = cleanedInput.split(/\s+/);
    const searchConditions = [];

    const fullRegex = { $regex: cleanedInput, $options: "i" };
    searchConditions.push(
      { first_name: fullRegex },
      { last_name: fullRegex },
      { email_id: fullRegex },
      { username: fullRegex },
      { registration_no: fullRegex },
      { ref_no: fullRegex },
      { mobile_no: fullRegex }
    );

    if (words.length > 1) {
      const [firstWord, secondWord] = words;
      searchConditions.push({
        $and: [
          { first_name: { $regex: firstWord, $options: "i" } },
          { last_name: { $regex: secondWord, $options: "i" } },
        ],
      });
      searchConditions.push({
        $and: [
          { first_name: { $regex: secondWord, $options: "i" } },
          { last_name: { $regex: firstWord, $options: "i" } },
        ],
      });
      if (words.length > 2) {
        const remainingWords = words.slice(2).join(" ");
        searchConditions.push({
          $and: [
            { first_name: { $regex: firstWord, $options: "i" } },
            { last_name: { $regex: `${secondWord} ${remainingWords}`, $options: "i" } },
          ],
        });
        searchConditions.push({
          $and: [
            { first_name: { $regex: `${firstWord} ${secondWord}`, $options: "i" } },
            { last_name: { $regex: remainingWords, $options: "i" } },
          ],
        });
      }
    }

    // Direct single query on unified user_tbl
    const users = await UserModel.find({ $or: searchConditions }).lean();

    const mappedUsers = users.map((user) => {
      let mobile_no = user.mobile_no;
      let email_id = user.email_id || user.username;
      if (req.user.user_role === "FreeUser") {
        mobile_no = null;
        email_id = null;
      }
      const regNo = user.registration_no || user.ref_no || "";
      const userObj = {
        ...user,
        registration_no: regNo,
        ref_no: regNo,
        user_role: user.user_role || user.type_of_user || "FreeUser",
        type_of_user: user.type_of_user || user.user_role || "FreeUser",
        mobile_no,
        email_id,
      };

      if (req.user.user_role?.toLowerCase() !== "admin") {
        delete userObj.password;
      }

      return userObj;
    });

    const processed = await processUserImages(mappedUsers, req.user.ref_no, req.user.user_role);

    if (!processed || processed.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found matching the input.",
        users: null,
      });
    }

    return res.status(200).json({
      success: true,
      users: processed,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const upgradeUser = async (req, res) => {
  try {
    const { registration_no } = req.params;
    const { userType, amountPaid, paidType, referenceNumber } = req.body;

    const filter = {
      $or: [{ registration_no }, { ref_no: registration_no }]
    };

    const profile = await UserModel.findOne(filter);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const effectiveRegNo = profile.registration_no || profile.ref_no || registration_no;

    let targetUserType = userType || "PremiumUser";
    const lowerType = (targetUserType || "").toLowerCase();
    if (lowerType.includes("silver")) {
      targetUserType = "SilverUser";
    } else if (lowerType.includes("premium")) {
      targetUserType = "PremiumUser";
    }

    const today = new Date();
    let updatedExpiryDate = new Date();

    if (targetUserType === "SilverUser") {
      updatedExpiryDate.setMonth(today.getMonth() + 6);
    } else if (targetUserType === "PremiumUser") {
      updatedExpiryDate.setFullYear(today.getFullYear() + 1);
    }

    let finalAmount = Number(amountPaid);
    if (isNaN(finalAmount) || typeof amountPaid === "undefined" || amountPaid === "" || finalAmount === 0) {
      if (targetUserType === "SilverUser") finalAmount = 799;
      else if (targetUserType === "PremiumUser") finalAmount = 999;
      else finalAmount = 0;
    }

    const lastTrans = await TransactionModel.findOne({}).sort({ transaction_id: -1, transcation_id: -1 }).lean();
    const lastId = lastTrans?.transaction_id || lastTrans?.transcation_id || 0;
    const nextId = Number(lastId) + 1;

    await TransactionModel.updateMany(
      { $or: [{ registration_no: effectiveRegNo }, { registration_no }] },
      { $set: { is_handled: true } }
    );

    const newTransaction = new TransactionModel({
      registration_no: effectiveRegNo,
      transaction_id: nextId,
      transcation_id: nextId,
      PG_id: Date.now().toString(),
      bank_ref_num: referenceNumber || Date.now().toString(),
      mode: "Admin Approval",
      amount: finalAmount,
      status: "success",
      orderno: Date.now().toString(),
      usertype: targetUserType,
      is_handled: true,
    });
    await newTransaction.save();

    const oldStatus = profile.status;

    // Single unified update directly on user_tbl
    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      {
        $set: {
          type_of_user: targetUserType,
          user_role: targetUserType,
          expiry_date: updatedExpiryDate,
          status: "active",
        },
      },
      { new: true }
    );

    if (updatedUser && oldStatus !== "active") {
      try {
        const { activatedSubject, activatedMessage } = getActiveMessage(updatedUser);
        if (activatedSubject && activatedMessage) {
          await sendMail(updatedUser.email_id || updatedUser.username, activatedSubject, activatedMessage);
        }
      } catch (emailErr) {
        console.error("Failed to send activation email during admin upgrade:", emailErr.message);
      }
    }

    if (updatedUser) {
      console.log("=== [CONSLODE LOG: UPGRADE USER ACTIVATION] Admin upgraded user:", effectiveRegNo, ". Triggering creditPromoterOnAdminAction ===");
      await creditPromoterOnAdminAction(updatedUser, Date.now().toString(), userType);
    }

    return res.status(200).json({
      success: true,
      message: "User upgraded successfully",
      data: {
        registration_no: effectiveRegNo,
        userType: targetUserType,
        expiry_date: updatedExpiryDate,
        status: "active",
      },
    });
  } catch (error) {
    console.error("upgradeUser error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUserImageVerification = async (req, res) => {
  try {
    const { page, pageSize } = getPaginationParams(req);
    const filter = {
      image_verification: { $in: ["pending", "Pending"] },
    };

    const totalRecords = await UserModel.countDocuments(filter);
    const content = await UserModel.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .select({
        ref_no: 1,
        registration_no: 1,
        first_name: 1,
        last_name: 1,
        email_id: 1,
        gender: 1,
        user_role: 1,
        image: 1,
        image_verification: 1,
        registration_date: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      content,
      currentPage: page,
      pageSize,
      totalRecords,
    });
  } catch (error) {
    console.error("getAllUserImageVerification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch image verification data"
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { registration_no } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findOne({
      $or: [{ ref_no: registration_no }, { registration_no }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Plain text comparison
    if (user.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Save new password directly
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitQrPayment = async (req, res) => {
  try {
    const { registration_no, user_id, planName, amount } = req.body;

    let query = {};
    if (registration_no) query = { $or: [{ registration_no }, { ref_no: registration_no }] };
    else if (user_id) query = { _id: user_id };
    else return res.status(400).json({ success: false, message: "User identification required" });

    const user = await UserModel.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const regNo = user.registration_no || user.ref_no || registration_no;

    const lastTrans = await TransactionModel.findOne({}).sort({ transaction_id: -1, transcation_id: -1 }).lean();
    const lastId = lastTrans?.transaction_id || lastTrans?.transcation_id || 0;
    const nextId = Number(lastId) + 1;

    let finalAmount = amount || 999;
    const lowerPlan = (planName || "").toLowerCase();
    let targetUserType = planName || "PremiumUser";
    if (lowerPlan === "silveruser" || lowerPlan === "silver" || lowerPlan.includes("silver")) {
      finalAmount = amount || 799;
      targetUserType = "SilverUser";
    } else if (lowerPlan === "premiumuser" || lowerPlan === "premium" || lowerPlan.includes("premium")) {
      finalAmount = amount || 999;
      targetUserType = "PremiumUser";
    } else if (lowerPlan === "assistance" || lowerPlan.includes("assistance")) {
      finalAmount = amount || 1499;
      targetUserType = "Assistance";
    }

    const newTransaction = new TransactionModel({
      registration_no: regNo,
      transaction_id: nextId,
      transcation_id: nextId,
      PG_id: Date.now().toString(),
      bank_ref_num: Date.now().toString(),
      mode: "Admin Approval",
      amount: finalAmount,
      status: "PENDING",
      orderno: Date.now().toString(),
      usertype: targetUserType,
      is_handled: false,
    });

    await newTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Payment request submitted successfully",
      transaction: newTransaction
    });
  } catch (error) {
    console.error("Error submitting QR payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfileByRegistrationNo,
  updateProfile,
  getAllUserDetails,
  changePassword,
  searchUsersByInput,
  getMyMatches,
  DeleteImage,
  getAllUserImageVerification,
  upgradeUser,
  getProfilesRenewal,
  submitQrPayment
};
