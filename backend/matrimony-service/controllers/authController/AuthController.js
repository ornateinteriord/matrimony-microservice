const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../../models/user");
const MagicLoginToken = require("../../models/MagicLoginToken");
const profile = require("../../models/profile");
const { sendMail } = require("../../utils/EmailService");
const { generateOTP, storeOTP, verifyOTP } = require("../../utils/OtpService");
const { FormatDate } = require("../../utils/DateFormate");
const PromotersModel = require("../../models/promoters/Promoters");
const { getWelcomeMessage, getResetPasswordMessage, getPostResetPasswordMessage } = require("../../utils/EmailMessages");
const { detectPlatform } = require("../../utils/common");
const { creditPromoterOnAdminAction } = require("../payment.controller");
const { handleControllerError } = require("../../utils/errorHandler");

const signUp = async (req, res) => {
  try {
    const { username, password, user_role, status, ...otherDetails } = req.body;

    // Process Full Name splitting and synchronization
    const rawFullName = (otherDetails.full_name || otherDetails.fullname || otherDetails.name || "").trim();
    let firstName = otherDetails.first_name || "";
    let lastName = otherDetails.last_name || "";

    if (rawFullName) {
      const parts = rawFullName.split(/\s+/);
      if (!firstName) firstName = parts[0] || "";
      if (!lastName) lastName = parts.slice(1).join(" ") || "";
    }

    const resolvedFullName = rawFullName || `${firstName} ${lastName}`.trim();

    otherDetails.first_name = firstName;
    otherDetails.last_name = lastName;
    otherDetails.full_name = resolvedFullName;
    otherDetails.fullname = resolvedFullName;

    // Mobile numbers processing
    if (otherDetails.mobile_numbers && Array.isArray(otherDetails.mobile_numbers)) {
      const validNumbers = otherDetails.mobile_numbers.map(n => String(n).trim()).filter(Boolean);
      otherDetails.mobile_numbers = validNumbers;
      if (!otherDetails.mobile_no && validNumbers.length > 0) {
        otherDetails.mobile_no = validNumbers[0];
      }
    } else if (otherDetails.mobile_no) {
      otherDetails.mobile_numbers = [String(otherDetails.mobile_no).trim()];
    }

    // Process parents' contact if father_contact/mother_contact provided
    if (Array.isArray(otherDetails.parents)) {
      otherDetails.parents = otherDetails.parents.map(p => {
        if (!p) return p;
        const rel = (p.relation || "").toLowerCase();
        let contact = p.contact || p.mobile_no || "";
        if (!contact && rel.includes("father") && otherDetails.father_contact) {
          contact = otherDetails.father_contact;
        }
        if (!contact && rel.includes("mother") && otherDetails.mother_contact) {
          contact = otherDetails.mother_contact;
        }
        return {
          ...p,
          contact: contact || undefined,
          mobile_no: contact || undefined
        };
      });
    }

    if (otherDetails.refered_by && typeof otherDetails.refered_by === 'string') {
      otherDetails.refered_by = otherDetails.refered_by.trim().toUpperCase();
    }

    const existingUser = await UserModel.findOne({ username });

    // If user already exists AND is inactive AND this is a paid plan retry — update instead of reject
    const isPaidPlan = user_role === "PremiumUser" || user_role === "SilverUser";
    if (existingUser) {
      if ((existingUser.status === "inactive" || existingUser.status === "Pending" || existingUser.status === "pending") && isPaidPlan) {
        // Update existing inactive/pending user with latest form data
        await UserModel.updateOne({ username }, { 
          $set: { 
            password, 
            user_role, 
            type_of_user: user_role, 
            status: "Pending", 
            ...otherDetails 
          } 
        });

        try {
          const TransactionModel = require("../../models/Transaction");
          const existingTxn = await TransactionModel.findOne({ registration_no: existingUser.ref_no });
          if (!existingTxn) {
            const lastTrans = await TransactionModel.findOne({}).sort({ transaction_id: -1, transcation_id: -1 }).lean();
            const lastId = lastTrans?.transaction_id || lastTrans?.transcation_id || 0;
            const nextId = Number(lastId) + 1;
            let finalAmount = user_role === "PremiumUser" ? 999 : 799;

            const retryOrderNo = `ORD_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
            const retryPgId = `PG_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;

            const newTxn = new TransactionModel({
              registration_no: existingUser.ref_no,
              transaction_id: nextId,
              transcation_id: nextId,
              PG_id: retryPgId,
              bank_ref_num: retryPgId,
              mode: "Admin Approval",
              amount: finalAmount,
              status: "PENDING",
              orderno: retryOrderNo,
              usertype: user_role,
              promocode: otherDetails.refered_by || null,
              discount_applied: 0,
              original_amount: finalAmount,
              is_handled: false
            });
            await newTxn.save();
            console.log(`=== [CONSLODE LOG: RETRY TRANSACTION] Created pending transaction in transaction_tbl for Reg No: ${existingUser.ref_no} ===`);
          } else {
            await TransactionModel.updateOne({ registration_no: existingUser.ref_no }, { $set: { status: "PENDING", usertype: user_role, promocode: otherDetails.refered_by || existingTxn.promocode } });
            console.log(`=== [CONSLODE LOG: RETRY TRANSACTION] Updated existing transaction to PENDING for Reg No: ${existingUser.ref_no} ===`);
          }
        } catch (retryTxnErr) {
          console.error("=== [CONSLODE LOG ERROR] Error updating retry transaction:", retryTxnErr, "===");
        }

        const token = jwt.sign(
          { user_id: existingUser.user_id, username, user_role, ref_no: existingUser.ref_no },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res.status(200).json({ success: true, token, message: "Registration updated for payment retry" });
      }
      return res.status(409).json({ success: false, message: "Username already exists" });
    }

    // Calculate candidateUserId and candidateRefNo with collision verification
    // 1. Determine highest existing user_id
    const maxUserById = await UserModel.findOne({ user_id: { $type: "number" } })
      .sort({ user_id: -1 })
      .select({ user_id: 1 })
      .lean();
    let candidateUserId = (maxUserById && !isNaN(maxUserById.user_id)) ? maxUserById.user_id + 1 : 1;

    // 2. Determine highest existing S-number in ref_no or registration_no
    const maxUserByRef = await UserModel.findOne({ ref_no: /^S\d+/ })
      .sort({ ref_no: -1 })
      .select({ ref_no: 1 })
      .lean();
    let candidateNum = candidateUserId;
    if (maxUserByRef && maxUserByRef.ref_no) {
      const extracted = parseInt(String(maxUserByRef.ref_no).replace(/\D/g, ''));
      if (!isNaN(extracted) && extracted >= candidateNum) {
        candidateNum = extracted + 1;
      }
    }
    let candidateRefNo = `S${String(candidateNum).padStart(4, "0")}`;

    // Loop until both candidateUserId and candidateRefNo are guaranteed unique
    let hasCollision = true;
    let attempts = 0;
    while (hasCollision && attempts < 500) {
      attempts++;
      const existing = await UserModel.findOne({
        $or: [
          { user_id: candidateUserId },
          { ref_no: candidateRefNo },
          { registration_no: candidateRefNo }
        ]
      }).select({ _id: 1, user_id: 1, ref_no: 1 }).lean();

      if (!existing) {
        hasCollision = false;
      } else {
        if (existing.user_id === candidateUserId) candidateUserId++;
        candidateNum++;
        candidateRefNo = `S${String(candidateNum).padStart(4, "0")}`;
      }
    }

    let newUserId = candidateUserId;
    let newRefNo = candidateRefNo;

    // For new users, set initial status to Pending
    const userStatus = status || "Pending";

    const currentDate = new Date();
    const formattedDate = FormatDate(currentDate);

    // For premium users, set initial type_of_user to match their plan but keep status inactive/pending
    const typeOfUser = (user_role === "PremiumUser" || user_role === "SilverUser")
      ? user_role
      : "FreeUser";

    let newUser = null;
    let saveAttempts = 0;
    while (!newUser && saveAttempts < 5) {
      saveAttempts++;
      try {
        const userToSave = new UserModel({
          user_id: newUserId,
          username,
          email_id: username,
          password,
          ref_no: newRefNo,
          registration_no: newRefNo,
          user_role,
          type_of_user: typeOfUser,
          status: userStatus,
          registration_date: formattedDate,
          ...otherDetails,
        });
        await userToSave.save();
        newUser = userToSave;
      } catch (saveErr) {
        if (saveErr.code === 11000 && (saveErr.keyPattern?.ref_no || saveErr.keyPattern?.registration_no || saveErr.keyPattern?.user_id || saveErr.message?.includes('ref_no') || saveErr.message?.includes('user_id'))) {
          console.warn(`[SIGNUP CONCURRENCY] Collision on ${newRefNo} or user_id ${newUserId}. Incrementing sequence...`);
          newUserId++;
          candidateNum++;
          newRefNo = `S${String(candidateNum).padStart(4, "0")}`;
        } else {
          throw saveErr;
        }
      }
    }
    const newProfile = newUser;

    if (newProfile && (newProfile.type_of_user === "SilverUser" || newProfile.type_of_user === "PremiumUser" || otherDetails.refered_by)) {
      try {
        const TransactionModel = require("../../models/Transaction");
        const lastTrans = await TransactionModel.findOne({}).sort({ transaction_id: -1, transcation_id: -1 }).lean();
        const lastId = lastTrans?.transaction_id || lastTrans?.transcation_id || 0;
        let nextId = Number(lastId) + 1;
        while (await TransactionModel.exists({ $or: [{ transaction_id: nextId }, { transcation_id: nextId }] })) {
          nextId++;
        }
        let finalAmount = newProfile.type_of_user === "PremiumUser" ? 999 : 799;

        const signupOrderNo = `ORD_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
        const signupPgId = `PG_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;

        const newTxn = new TransactionModel({
          registration_no: newRefNo,
          transaction_id: nextId,
          transcation_id: nextId,
          PG_id: signupPgId,
          bank_ref_num: signupPgId,
          mode: "Admin Approval",
          amount: finalAmount,
          status: (newProfile.status === "active" || newProfile.status === "Active") ? "SUCCESS" : "PENDING",
          orderno: signupOrderNo,
          usertype: newProfile.type_of_user,
          promocode: otherDetails.refered_by || null,
          discount_applied: 0,
          original_amount: finalAmount,
          is_handled: (newProfile.status === "active" || newProfile.status === "Active")
        });
        await newTxn.save();
        console.log(`=== [CONSLODE LOG: SIGNUP TRANSACTION] Created transaction in transaction_tbl for Reg No: ${newRefNo} | Promocode: ${otherDetails.refered_by || 'None'} | Status: ${newTxn.status} ===`);

        // If user was created directly as active, credit promoter immediately
        if (newProfile.status === "active" || newProfile.status === "Active") {
          console.log("=== [CONSLODE LOG: SIGNUP ACTIVE] User created directly as active. Triggering creditPromoterOnAdminAction ===");
          await creditPromoterOnAdminAction(newProfile, Date.now().toString(), newProfile.type_of_user);
        }
      } catch (txnErr) {
        console.error("=== [CONSLODE LOG ERROR] Error creating signup transaction:", txnErr, "===");
      }
    }

    try {
      const { welcomeMessage, welcomeSubject } = getWelcomeMessage(otherDetails, newRefNo);
      await sendMail(username, welcomeSubject, welcomeMessage);
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    const validUserRoles = ["FreeUser", "PremiumUser", "SilverUser", "Admin"];
    const tokenUserRole = validUserRoles.includes(newUser.user_role)
      ? newUser.user_role
      : "user";

    // Include profile data in token for signup
    const profileData = {
      first_name: otherDetails.first_name,
      last_name: otherDetails.last_name,
      full_name: resolvedFullName,
      fullname: resolvedFullName,
      email_id: username,
      mobile_no: otherDetails.mobile_no,
      mobile_numbers: otherDetails.mobile_numbers,
      age: otherDetails.age,
      city: otherDetails.city,
      type_of_user: newUser.user_role,
      status: newProfile.status || 'inactive'
    };

    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        username: newUser.username,
        user_role: tokenUserRole,
        ref_no: newRefNo,
        ...profileData // Include profile data in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );


    return res.status(201).json({
      success: true,
      token,
      message: "Signup successful",
    });
  } catch (error) {
    console.error("signUp error:", error);
    return handleControllerError(res, error, "Failed to complete signup");
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await UserModel.findOne({ username });
    const promoter = await PromotersModel.findOne({
      $or: [
        { username: username },
        { email: username.toLowerCase() },
        { promoter_id: username.toUpperCase() }
      ]
    });

    const authUser = user || promoter;
    const userType = user ? "user" : "promoter";

    if (!authUser) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please check your username or register.",
      });
    }

    const isPasswordValid = authUser.password === password;

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // Check if account is active
    const targetStatus = user ? user.status : (promoter ? promoter.status : "active");
    if (targetStatus && targetStatus.toLowerCase() !== "active") {
      const isPending =
        targetStatus.toLowerCase() === "pending" ||
        targetStatus.toLowerCase() === "inactive";
      return res.status(400).json({
        success: false,
        message: isPending
          ? "Member under pending approval by admin."
          : "Your account is not yet activated. Please wait for admin approval.",
        accountStatus: targetStatus,
      });
    }

    const validUserRoles = ["user", "FreeUser", "PremiumUser", "SilverUser", "Admin", "promoter"];
    const userRole = user
      ? (validUserRoles.includes(user.user_role) ? user.user_role : "user")
      : "promoter";

    const profileData = await profile.findOne({ registration_no: authUser.ref_no });
    const userFullName = profileData?.full_name || profileData?.fullname || `${profileData?.first_name || authUser?.first_name || ""} ${profileData?.last_name || authUser?.last_name || ""}`.trim();

    const token = jwt.sign(
      {
        user_id: authUser.user_id,
        username: authUser.username,
        user_role: userRole,
        ref_no: authUser.ref_no,
        promoter_id: promoter ? promoter.promoter_id : undefined,
        first_name: profileData?.first_name || authUser?.first_name,
        last_name: profileData?.last_name || authUser?.last_name,
        full_name: userFullName,
        fullname: userFullName,
        email_id: profileData?.email_id || authUser?.email_id,
        mobile_no: profileData?.mobile_no || authUser?.mobile_no,
        mobile_numbers: profileData?.mobile_numbers || authUser?.mobile_numbers,
        age: profileData?.age || authUser?.age,
        city: profileData?.city || authUser?.city,
        type_of_user: profileData?.type_of_user || authUser?.type_of_user,
        status: authUser.status || profileData?.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const platform = detectPlatform(req);

    await UserModel.updateOne(
      { username },
      {
        $set: {
          last_loggedin: new Date().toISOString(),
          loggedin_from: req.ip,
          loggedin_platform: platform,
        },
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        user_id: authUser.user_id,
        username: authUser.username,
        user_role: userRole,
        ref_no: authUser.ref_no,
        first_name: profileData?.first_name || authUser?.first_name,
        last_name: profileData?.last_name || authUser?.last_name,
        full_name: userFullName,
        fullname: userFullName,
        email_id: profileData?.email_id || authUser?.email_id,
        mobile_no: profileData?.mobile_no || authUser?.mobile_no,
        mobile_numbers: profileData?.mobile_numbers || authUser?.mobile_numbers,
        age: profileData?.age || authUser?.age,
        city: profileData?.city || authUser?.city,
        type_of_user: profileData?.type_of_user || authUser?.type_of_user,
        status: authUser.status || profileData?.status,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, otp, newPassword, projectName } = req.body;
    const resolvedProjectName = projectName || process.env.PROJECT_NAME;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // If only username is provided (no OTP), send OTP to user
    if (username && !otp && !newPassword) {
      try {
        const { generateOTP, storeOTP } = require("../../utils/OtpService");
        const { sendMail } = require("../../utils/EmailService");
        const { getResetPasswordMessage } = require("../../utils/EmailMessages");

        const otpCode = generateOTP();
        storeOTP(username, otpCode);

        const { resetPasswordMessage, resetPasswordSubject } = getResetPasswordMessage(otpCode, resolvedProjectName);
        await sendMail(username, resetPasswordSubject, resetPasswordMessage, resolvedProjectName);

        return res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      } catch (emailError) {
        console.error("Email error:", emailError);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send OTP" });
      }
    }

    // If username, OTP, and newPassword are provided, reset password
    if (username && otp && newPassword) {
      const isOTPValid = await verifyOTP(username, otp);
      if (!isOTPValid) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired OTP" });
      }

      user.password = newPassword;
      await user.save();

      const { resetConfirmSubject, resetConfirmMessage } =
        getPostResetPasswordMessage(resolvedProjectName);
      await sendMail(user.username, resetConfirmSubject, resetConfirmMessage, resolvedProjectName);
      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    }

    // If invalid combination of parameters
    return res
      .status(400)
      .json({ success: false, message: "Invalid request parameters" });
  } catch (error) {
    return handleControllerError(res, error, "Failed to reset password");
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProfiles = await profile.countDocuments({});
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of current week (Sunday)

    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Start of current month

    const thisWeekRegistrations = await profile.countDocuments({
      $expr: {
        $gte: [
          {
            $dateFromString: {
              dateString: "$registration_date",
              format: "%m/%d/%Y",
            },
          },
          startOfWeek,
        ],
      },
    });

    const thisMonthRegistrations = await profile.countDocuments({
      $expr: {
        $gte: [
          {
            $dateFromString: {
              dateString: "$registration_date",
              format: "%m/%d/%Y",
            },
          },
          startOfMonth,
        ],
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProfiles,
        thisWeekRegistrations,
        thisMonthRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentRegisters = async (req, res) => {
  try {
    const recentMembers = await profile
      .find({})
      .sort({ _id: -1 })
      .limit(6)
      .lean()
      .select({
        registration_no: 1,
        first_name: 1,
        last_name: 1,
        age: 1,
        occupation: 1,
        educational_qualification: 1,
        city: 1,
        caste: 1,
        _id: 0,
      });

    const formattedMembers = recentMembers.map(
      ({ first_name, last_name, ...rest }) => ({
        ...rest,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
      })
    );

    res.status(200).json(formattedMembers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateLoginLink = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required to generate a login link",
      });
    }

    const trimmedUsername = username.trim();
    const user = await UserModel.findOne({
      $or: [
        { username: trimmedUsername },
        { email_id: trimmedUsername },
        { registration_no: trimmedUsername },
        { ref_no: trimmedUsername },
        { mobile_no: trimmedUsername },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please verify the username/registration number.",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please verify the credentials.",
      });
    }

    if (user.status && user.status.toLowerCase() !== "active") {
      return res.status(400).json({
        success: false,
        message: `User account is currently "${user.status}". Only active user accounts can be logged in.`,
      });
    }

    // Generate random secure token (32 bytes = 64 hex characters)
    const randomToken = crypto.randomBytes(32).toString("hex");

    // 15 days expiration as requested
    const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const promoterId = req.user?.promoter_id || req.user?.username || null;

    const magicToken = new MagicLoginToken({
      token: randomToken,
      user_id: user.user_id,
      username: user.username,
      promoter_id: promoterId,
      is_used: false,
      expires_at: expiresAt,
    });

    await magicToken.save();

    const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const loginUrl = `${origin}/login?token=${randomToken}`;

    return res.status(200).json({
      success: true,
      message: "One-time login link generated successfully",
      loginUrl,
      token: randomToken,
      expiresAt,
      user: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        registration_no: user.ref_no || user.registration_no,
      },
    });
  } catch (error) {
    console.error("generateLoginLink error:", error);
    return handleControllerError(res, error, "Server error while generating login link");
  }
};

const magicLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Login token is required",
      });
    }

    const trimmedToken = token.trim();
    const tokenDoc = await MagicLoginToken.findOne({ token: trimmedToken });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid login link. It may not exist or has been removed.",
      });
    }

    if (tokenDoc.is_used) {
      return res.status(400).json({
        success: false,
        message: "This login link has already been used. Please log in with your credentials or request a new link.",
        alreadyUsed: true,
      });
    }

    if (new Date() > new Date(tokenDoc.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "This login link has expired. Please request a new link.",
        expired: true,
      });
    }

    // Atomically burn the token on first use
    const updatedToken = await MagicLoginToken.findOneAndUpdate(
      { _id: tokenDoc._id, is_used: false },
      { $set: { is_used: true, used_at: new Date() } },
      { new: true }
    );

    if (!updatedToken) {
      return res.status(400).json({
        success: false,
        message: "This login link has already been used.",
        alreadyUsed: true,
      });
    }

    const user = await UserModel.findOne({
      $or: [
        { user_id: tokenDoc.user_id },
        { username: tokenDoc.username },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associated user not found.",
      });
    }

    if (user.status && user.status.toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: "Member under pending approval by admin.",
        accountStatus: user.status,
      });
    }

    const validUserRoles = ["user", "FreeUser", "PremiumUser", "SilverUser", "Admin", "promoter"];
    const userRole = validUserRoles.includes(user.user_role) ? user.user_role : "user";
    const profileData = await profile.findOne({ registration_no: user.ref_no });

    // 15 days JWT session as requested
    const jwtToken = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        user_role: userRole,
        ref_no: user.ref_no,
        first_name: profileData?.first_name || user.first_name,
        last_name: profileData?.last_name || user.last_name,
        email_id: profileData?.email_id || user.email_id || user.username,
        mobile_no: profileData?.mobile_no || user.mobile_no,
        age: profileData?.age || user.age,
        city: profileData?.city || user.city,
        type_of_user: profileData?.type_of_user || user.type_of_user,
        status: user.status || profileData?.status,
        otherInfo: user.otherInfo || "Completed",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    const platform = detectPlatform(req);

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          last_loggedin: new Date().toISOString(),
          loggedin_from: req.ip,
          loggedin_platform: platform,
        },
      }
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        user_id: user.user_id,
        username: user.username,
        user_role: userRole,
        ref_no: user.ref_no,
        first_name: profileData?.first_name || user.first_name,
        last_name: profileData?.last_name || user.last_name,
        email_id: profileData?.email_id || user.email_id,
        mobile_no: profileData?.mobile_no || user.mobile_no,
        age: profileData?.age || user.age,
        city: profileData?.city || user.city,
        type_of_user: profileData?.type_of_user || user.type_of_user,
        status: user.status || profileData?.status,
        otherInfo: user.otherInfo || "Completed",
      },
      message: "Logged in successfully via one-time link",
    });
  } catch (error) {
    console.error("magicLogin error:", error);
    return handleControllerError(res, error, "Server error during magic login");
  }
};

module.exports = {
  signUp,
  login,
  resetPassword,
  getDashboardStats,
  getRecentRegisters,
  generateLoginLink,
  magicLogin,
};