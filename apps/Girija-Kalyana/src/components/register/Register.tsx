import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Lock,
  Star,
  WorkspacePremium,
  LocalOffer,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import SEOHead from "../common/SEOHead";
import { toast } from "react-toastify";
import { useSignupMutation, useCheckPromocode } from "../api/Auth";
import useSponsorCode from "../../hooks/useSponsorCode";

import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingComponent } from "../../App";
import CustomAutocomplete from "../Autocomplete/CustomAutocomplete";
import { load } from "@cashfreepayments/cashfree-js";
import { post } from "../api/authHooks";
import { membershipOptions } from "../../assets/memberShipOptions/MemberShipPlans";

const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mutate, isPending } = useSignupMutation();

  // Store planType in state so it stays stable across re-renders
  const searchParams = new URLSearchParams(location.search);
  const [planType] = useState(() => searchParams.get("type") || null);



  // Sponsor / referral code lock state hook
  const sponsor = useSponsorCode();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Promo code state
  const [promocode, setPromocode] = useState(searchParams.get("promocode") || "");
  const [isPromoApplied, setIsPromoApplied] = useState(!!searchParams.get("promocode"));
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);

  const checkPromocodeMutation = useCheckPromocode();

  const [citySuggestions, setCitySuggestions] = useState(datas.cities || []);
  const [talukSuggestions, setTalukSuggestions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const getUserRole = () => {
    console.log("getUserRole called with planType:", planType);
    switch (planType) {
      case "PremiumUser":
        return "PremiumUser";
      case "SilverUser":
        return "SilverUser";
      default:
        return "FreeUser";
    }
  };

  const initialFormState = {
    user_role: getUserRole(),
    marital_status: "",
    profilefor: "",
    gender: "",
    date_of_birth: "",
    age: "",
    educational_qualification: "",
    occupation: "",
    income_per_month: "",
    country: "",
    mother_tongue: "",
    name_of_parent: "",
    parent_name: "",
    parents: [
      { relation: "Father", name: "", contact: "" },
      { relation: "Mother", name: "", contact: "" },
    ],
    religion: "Hindu",
    caste: "",
    address: "",
    occupation_country: "",
    state: "",
    city: "",
    full_name: "",
    first_name: "",
    last_name: "",
    username: "",
    mobile_no: "",
    mobile_numbers: [""],
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(() => ({
    user_role: getUserRole(),
    marital_status: "",
    profilefor: "",
    gender: "",
    date_of_birth: "",
    age: "",
    educational_qualification: "",
    occupation: "",
    income_per_month: "",
    country: "",
    mother_tongue: "",
    name_of_parent: "",
    parent_name: "",
    parents: [
      { relation: "Father", name: "", contact: "" },
      { relation: "Mother", name: "", contact: "" },
    ],
    religion: "Hindu",
    caste: "",
    address: "",
    occupation_country: "",
    state: "",
    city: "",
    full_name: "",
    first_name: "",
    last_name: "",
    username: "",
    mobile_no: "",
    mobile_numbers: [""],
    password: "",
    confirmPassword: "",
  }));

  useEffect(() => {
    console.log("planType changed to:", planType);
    setFormData((prev) => ({
      ...prev,
      user_role: getUserRole(),
    }));
  }, [planType]);

  useEffect(() => {
    if (formData.state) {
      const filteredCities =
        datas.cities?.filter((city) =>
          city.toLowerCase().includes(formData.state.toLowerCase())
        ) || [];
      setCitySuggestions(filteredCities);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = datas.districts?.find(
        (d) => d.name.toLowerCase() === formData.district.toLowerCase()
      );
      setTalukSuggestions(selectedDistrict?.taluks || []);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For mobile number field - only allow numbers up to 10 digits
    if (name === "mobile_no") {
      if (value === "" || /^\d{0,10}$/.test(value)) {
        setFormData((prev: any) => {
          const numbers = [...(prev.mobile_numbers || [""])];
          numbers[0] = value;
          return { ...prev, mobile_no: value, mobile_numbers: numbers };
        });
      }
      return;
    }

    if (name === "full_name") {
      const parts = value.trim().split(/\s+/);
      setFormData((prev: any) => ({
        ...prev,
        full_name: value,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
      }));
      return;
    }

    // For age field - only allow numbers
    if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "date_of_birth") {
      const age = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        age: age.toString(),
      }));
    } else if (name === "district") {
      const selectedDistrict = datas.districts?.find(
        (d) => d.name.toLowerCase() === value.toLowerCase()
      );
      setTalukSuggestions(selectedDistrict?.taluks || []);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMobileNumberChange = (index: number, value: string) => {
    if (value === "" || /^\d{0,10}$/.test(value)) {
      setFormData((prev: any) => {
        const numbers = [...(prev.mobile_numbers || [""])];
        numbers[index] = value;
        return {
          ...prev,
          mobile_numbers: numbers,
          mobile_no: numbers[0] || "",
        };
      });
    }
  };

  const handleAddMobileNumber = () => {
    setFormData((prev: any) => ({
      ...prev,
      mobile_numbers: [...(prev.mobile_numbers || [prev.mobile_no || ""]), ""],
    }));
  };

  const handleRemoveMobileNumber = (index: number) => {
    setFormData((prev: any) => {
      const numbers = (prev.mobile_numbers || [""]).filter((_: any, i: number) => i !== index);
      const finalNumbers = numbers.length > 0 ? numbers : [""];
      return {
        ...prev,
        mobile_numbers: finalNumbers,
        mobile_no: finalNumbers[0] || "",
      };
    });
  };

  const handleParentChange = (index: number, field: "relation" | "name" | "contact", val: string) => {
    setFormData((prev: any) => {
      const updated = [...(prev.parents || [])];
      if (!updated[index]) updated[index] = { relation: "Father", name: "", contact: "" };
      updated[index][field] = val;

      const validParents = updated.filter((p: any) => p.name?.trim());
      const parentNames = validParents.map((p: any) => `${p.relation}: ${p.name.trim()}`).join(", ");
      const primaryParent = updated[0]?.relation || "Father";

      return {
        ...prev,
        parents: updated,
        name_of_parent: primaryParent,
        parent_name: parentNames || updated[0]?.name || "",
      };
    });
  };

  const handleAddParent = () => {
    setFormData((prev: any) => {
      const current = prev.parents || [];
      const defaultNext = current.some((p: any) => p.relation === "Father") && !current.some((p: any) => p.relation === "Mother")
        ? "Mother"
        : "Guardian";
      return {
        ...prev,
        parents: [...current, { relation: defaultNext, name: "", contact: "" }],
      };
    });
  };

  const handleRemoveParent = (index: number) => {
    setFormData((prev: any) => {
      const updated = (prev.parents || []).filter((_: any, i: number) => i !== index);
      const finalParents = updated.length > 0 ? updated : [{ relation: "Father", name: "", contact: "" }];
      const validParents = finalParents.filter((p: any) => p.name?.trim());
      const parentNames = validParents.map((p: any) => `${p.relation}: ${p.name.trim()}`).join(", ");
      return {
        ...prev,
        parents: finalParents,
        name_of_parent: finalParents[0]?.relation || "",
        parent_name: parentNames || finalParents[0]?.name || "",
      };
    });
  };

  const calculateAge = (dob: any) => {
    if (!dob) return 0;
    const birthDayjs = dayjs(dob);
    if (!birthDayjs.isValid()) return 0;
    return dayjs().diff(birthDayjs, "year");
  };

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy (DPDP Act 2023) to continue.");
      return;
    }

    if (!formData.full_name?.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const primaryMobile = (formData.mobile_numbers?.[0] || formData.mobile_no || "").trim();
    if (!/^[0-9]{10}$/.test(primaryMobile)) {
      toast.error("Please enter a valid 10-digit primary mobile number");
      return;
    }

    if (Array.isArray(formData.mobile_numbers)) {
      for (let i = 1; i < formData.mobile_numbers.length; i++) {
        const num = (formData.mobile_numbers[i] || "").trim();
        if (num && !/^[0-9]{10}$/.test(num)) {
          toast.error(`Mobile number #${i + 1} must be a valid 10-digit number`);
          return;
        }
      }
    }

    if (Array.isArray(formData.parents)) {
      for (let i = 0; i < formData.parents.length; i++) {
        const pContact = (formData.parents[i]?.contact || "").trim();
        if (pContact && !/^[0-9]{10}$/.test(pContact)) {
          toast.error(`${formData.parents[i]?.relation || 'Parent'} contact must be a valid 10-digit number`);
          return;
        }
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const nameParts = formData.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const validMobileNumbers = (formData.mobile_numbers || [primaryMobile]).map((n: string) => n.trim()).filter(Boolean);

    const submissionData = {
      ...formData,
      full_name: formData.full_name.trim(),
      fullname: formData.full_name.trim(),
      first_name: firstName,
      last_name: lastName,
      mobile_no: primaryMobile,
      mobile_numbers: validMobileNumbers,
      refered_by: sponsor.code || undefined,
    };

    // For paid plans, show payment dialog instead of direct registration
    const isPaidPlan = planType === "PremiumUser" || planType === "SilverUser" ||
      formData.user_role === "PremiumUser" || formData.user_role === "SilverUser";

    if (isPaidPlan) {
      setPaymentDialogOpen(true);
    } else {
      // For free users, proceed with normal registration
      try {
        mutate(submissionData, {
          onSuccess: () => {
            toast.success("Registration successful");
          },
        });
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  const handlePaymentConfirm = async () => {
    setIsProcessingPayment(true);
    setPaymentDialogOpen(false);

    try {
      // Step 1: Create payment order FIRST (before registering user)
      const orderId = "order_" + Date.now();
      const planName = planType === "PremiumUser" ? "PREMIUM MEMBERSHIP" : "SILVER MEMBERSHIP";
      const plan = membershipOptions.find(p => p.name === planName);

      const originalAmount = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
      const finalAmount = isPromoApplied ? Math.max(originalAmount - 100, 0) : originalAmount;
      const planTypeCode = planType === "PremiumUser" ? 'premium' : 'silver';

      const promoToUse = sponsor.code || promocode || null;
      const primaryMobile = (formData.mobile_numbers?.[0] || formData.mobile_no || "").trim();
      const nameParts = (formData.full_name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const validMobileNumbers = (formData.mobile_numbers || [primaryMobile]).map((n: string) => n.trim()).filter(Boolean);

      const orderResponse = await post("/api/payment/create-order", {
        orderId,
        orderAmount: finalAmount,
        customerName: formData.full_name.trim(),
        customerEmail: formData.username,
        customerPhone: primaryMobile,
        planType: planTypeCode,
        promocode: promoToUse,
        originalAmount,
        context: "registration"
      });

      if (!orderResponse?.payment_session_id) {
        throw new Error(orderResponse?.error || "Failed to create payment order. Please try again.");
      }

      // Step 2: Order created successfully — now register user as inactive
      const registrationResponse = await post("/api/auth/signup", {
        ...formData,
        full_name: formData.full_name.trim(),
        fullname: formData.full_name.trim(),
        first_name: firstName,
        last_name: lastName,
        mobile_no: primaryMobile,
        mobile_numbers: validMobileNumbers,
        refered_by: sponsor.code || undefined,
        status: "inactive"
      });

      if (!registrationResponse.success) {
        throw new Error(registrationResponse.message || "Registration failed. Please try again.");
      }

      // Step 3: Store order details for post-payment verification
      localStorage.setItem('pendingOrderId', orderId);
      localStorage.setItem('pendingOrderEmail', formData.username);
      localStorage.setItem(`orderTimestamp_${orderId}`, Date.now().toString());

      // Step 4: Open Cashfree checkout (redirects user to payment page)
      const cashfreeMode = orderResponse.cashfree_env || "sandbox";
      const cashfree = await load({ mode: cashfreeMode });
      cashfree.checkout({
        paymentSessionId: orderResponse.payment_session_id,
        redirectTarget: "_self"  // Same tab
      });

    } catch (error) {
      console.error("Payment initiation failed:", error);

      // Extract friendly message from backend response or use fallbacks
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      let toastMessage;
      if (backendMessage) {
        toastMessage = backendMessage; // Use backend's message directly
      } else if (status === 409) {
        toastMessage = "This email is already registered. Please use a different email.";
      } else if (status === 400) {
        toastMessage = "Invalid details. Please check your form and try again.";
      } else if (status === 500) {
        toastMessage = "Server error. Please try again later.";
      } else {
        toastMessage = "Failed to complete registration. Please try again.";
      }

      toast.error(toastMessage);
      setIsProcessingPayment(false);
    }
  };

  const isValidAge = (value) => {
    if (value === "") return true; // Allow empty field
    return /^\d+$/.test(value); // Check if it's only digits
  };

  // Calculate plan amounts for display using membershipOptions
  const getPlanDetails = () => {
    if (planType === "PremiumUser") {
      const plan = membershipOptions.find(p => p.name === 'PREMIUM MEMBERSHIP');
      const originalPrice = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
      const discountedPrice = isPromoApplied ? Math.max(originalPrice - 100, 0) : originalPrice;
      return { originalPrice, discountedPrice, displayPrice: plan.discountedPrice };
    } else if (planType === "SilverUser") {
      const plan = membershipOptions.find(p => p.name === 'SILVER MEMBERSHIP');
      const originalPrice = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
      const discountedPrice = isPromoApplied ? Math.max(originalPrice - 100, 0) : originalPrice;
      return { originalPrice, discountedPrice, displayPrice: plan.discountedPrice };
    }
    return { originalPrice: 0, discountedPrice: 0, displayPrice: '₹0' };
  };

  const { originalPrice, discountedPrice } = getPlanDetails();

  // Handle promocode application
  const handleApplyPromocode = () => {
    if (!promocode.trim()) {
      return;
    }

    checkPromocodeMutation.mutate(
      { promocode: promocode.trim() },
      {
        onSuccess: (response) => {
          setIsPromoApplied(true);
          // Update URL with promocode without reloading the page
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.set("promocode", promocode.trim());
          navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
          setPromoDialogOpen(false);
          toast.success("Promocode applied successfully! ₹100 discount applied.");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Invalid promocode");
          setIsPromoApplied(false);
        }
      }
    );
  };

  const handleRemovePromocode = () => {
    setPromocode("");
    setIsPromoApplied(false);
    // Remove promocode from URL
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete("promocode");
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
  };

  const handleOpenPromoDialog = () => {
    setPromoDialogOpen(true);
  };

  const handleClosePromoDialog = () => {
    setPromoDialogOpen(false);
  };



  return (
    <>
      <Navbar />
      {isPending && <LoadingComponent />}
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: { xs: 1, sm: 2 },
          mt: "10px",
          width: isMobile ? "100%" : "85%",
          display: "flex",
          justifyContent: "center",
          justifySelf: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: isMobile ? "15px" : "",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <HowToRegIcon />
              </Avatar>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{ fontWeight: 500 }}
              >
                Register Here!
              </Typography>
            </Box>

            <Box
              sx={{
                fontSize: { xs: "18px", sm: "22px" },
                backgroundColor: "transparent",
                color: "black",
                py: 1,
                borderRadius: 1,
                fontWeight: 500,
              }}
            >
              Registering as:{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                }}
              >
                {getUserRole()}
              </Box>
            </Box>
          </Box>

          {/* Plan Info Banner — shown only for paid plans */}
          {planType && (planType === "PremiumUser" || planType === "SilverUser") && (
            <Box
              sx={{
                mb: 3,
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                background: planType === "PremiumUser"
                  ? "linear-gradient(135deg, #881337 0%, #9f1239 100%)"
                  : "linear-gradient(135deg, #b45309 0%, #D97706 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(136, 19, 55, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circle */}
              <Box sx={{
                position: "absolute", right: -20, top: -20,
                width: 100, height: 100, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)"
              }} />

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                {/* Left — Plan name & pricing */}
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                    Selected Plan
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    {planType === "PremiumUser" ? (
                      <>
                        <Star sx={{ color: "#F59E0B", fontSize: 24 }} /> Premium Membership
                      </>
                    ) : (
                      <>
                        <WorkspacePremium sx={{ color: "#F3F4F6", fontSize: 24 }} /> Silver Membership
                      </>
                    )}
                  </Typography>

                  {/* Pricing */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    {isPromoApplied ? (
                      <>
                        <Typography variant="body1" sx={{ textDecoration: "line-through", opacity: 0.65 }}>
                          ₹{originalPrice}
                        </Typography>
                        <Typography variant="body2" sx={{ bgcolor: "rgba(76,175,80,0.25)", px: 1, py: 0.3, borderRadius: 1, color: "#a5d6a7" }}>
                          − ₹100 promo
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#a5d6a7" }}>
                          ₹{discountedPrice}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        ₹{originalPrice}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Right — Action buttons */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: { xs: "flex-start", sm: "flex-end" } }}>
                  {!isPromoApplied ? (
                    <Button
                      size="small"
                      onClick={handleOpenPromoDialog}
                      startIcon={<LocalOffer sx={{ fontSize: 16 }} />}
                      sx={{
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.6)",
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" }
                      }}
                    >
                      Apply Promocode
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={handleRemovePromocode}
                      sx={{
                        color: "#ffcdd2",
                        border: "1px solid rgba(255,100,100,0.5)",
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        "&:hover": { bgcolor: "rgba(255,100,100,0.1)" }
                      }}
                    >
                      ✕ Remove Promo
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => {
                      setIsPromoApplied(false);
                      setPromocode("");
                      navigate(`/register`, { replace: true });
                    }}
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      textTransform: "none",
                      fontSize: "0.75rem",
                      p: 0,
                      "&:hover": { color: "#fff", bgcolor: "transparent" }
                    }}
                  >
                    Change plan
                  </Button>
                </Box>
              </Box>
            </Box>
          )}


          <Divider sx={{ height: "1px", mb: isMobile ? 1 : 2 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
                PERSONAL DETAILS
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  label="Marital Status"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                >
                  {datas.marritalStatus?.map((item, idx) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel>Create Profile For</InputLabel>
                <Select
                  label="Create Profile For"
                  name="profilefor"
                  value={formData.profilefor}
                  onChange={handleChange}
                >
                  <MenuItem value="Self">Self</MenuItem>
                  <MenuItem value="Son">Son</MenuItem>
                  <MenuItem value="Daughter">Daughter</MenuItem>
                  <MenuItem value="Brother">Brother</MenuItem>
                  <MenuItem value="Sister">Sister</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="BrideGroom">Male</MenuItem>
                  <MenuItem value="Bride">Female</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="DD/MM/YYYY"
                  value={
                    formData.date_of_birth
                      ? dayjs(formData.date_of_birth)
                      : null
                  }
                  onChange={(newValue) => {
                    if (!newValue || !newValue.isValid()) {
                      setFormData((prev: any) => ({ ...prev, date_of_birth: "", age: "" }));
                      return;
                    }
                    const dob = newValue.format("YYYY-MM-DD");
                    const age = calculateAge(dob);
                    setFormData((prev: any) => ({
                      ...prev,
                      date_of_birth: dob,
                      age: age.toString(),
                    }));
                  }}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "Format: DD/MM/YYYY",
                      sx: { mb: 3 },
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Age"
                type="text" // Changed from "number" to "text"
                sx={{ mb: 3 }}
                name="age"
                value={formData.age}
                onChange={handleChange}
                InputLabelProps={{ shrink: !!formData.age }}
                error={!isValidAge(formData.age)} // Show error state if not valid
                helperText={
                  !isValidAge(formData.age) ? "Please enter a valid number" : ""
                }
              />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
              >
                SOCIAL & CAREER DETAILS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.qualificationValues ?? []}
                    label="Educational Qualification"
                    name="educational_qualification"
                    value={formData.educational_qualification}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.occupationValues ?? []}
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.incomeValues ?? []}
                    label="Income Per Annum"
                    name="income_per_month"
                    value={formData.income_per_month}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.countries ?? []}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.languageValues ?? []}
                    label="Mother Tongue"
                    name="mother_tongue"
                    value={formData.mother_tongue}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
                FAMILY DETAILS
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#334155" }}>
                    Parents / Guardians Details
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddParent}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                      borderRadius: "4px",
                      py: 0.4,
                      px: 1.2,
                      "&:hover": { borderColor: "primary.dark", backgroundColor: "rgba(112, 15, 43, 0.05)" },
                    }}
                  >
                    Add Parent
                  </Button>
                </Box>

                {(formData.parents || [{ relation: "Father", name: "", contact: "" }]).map((parentItem: any, pIdx: number) => (
                  <Box
                    key={`parent-field-${pIdx}`}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      alignItems: { xs: "stretch", sm: "center" },
                      mb: 1.5,
                      p: 1.5,
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <FormControl size="small" sx={{ width: { xs: "100%", sm: "130px" } }}>
                      <InputLabel>Relation</InputLabel>
                      <Select
                        label="Relation"
                        value={parentItem.relation || "Father"}
                        onChange={(e) => handleParentChange(pIdx, "relation", e.target.value)}
                      >
                        <MenuItem value="Father">Father</MenuItem>
                        <MenuItem value="Mother">Mother</MenuItem>
                        <MenuItem value="Step-Father">Step-Father</MenuItem>
                        <MenuItem value="Step-Mother">Step-Mother</MenuItem>
                        <MenuItem value="Guardian">Guardian</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      size="small"
                      fullWidth
                      label={`${parentItem.relation || "Parent"} Name`}
                      placeholder="Enter full name"
                      value={parentItem.name || ""}
                      onChange={(e) => handleParentChange(pIdx, "name", e.target.value)}
                    />

                    <TextField
                      size="small"
                      fullWidth
                      label={`${parentItem.relation || "Parent"} Contact (Optional)`}
                      placeholder="10-digit number"
                      value={parentItem.contact || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d{0,10}$/.test(val)) {
                          handleParentChange(pIdx, "contact", val);
                        }
                      }}
                      inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                      error={Boolean(parentItem.contact && !/^[0-9]{10}$/.test(parentItem.contact))}
                      helperText={parentItem.contact && !/^[0-9]{10}$/.test(parentItem.contact) ? "10 digits required" : ""}
                    />

                    {(formData.parents || []).length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveParent(pIdx)}
                        title="Remove"
                        sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              <TextField
                fullWidth
                label="Religion"
                name="religion"
                value="Hindu"
                disabled
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={datas.casteValues ?? []}
                label="Caste"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                sx={{ mb: 3 }}
                value={formData.address}
                onChange={handleChange}
              />

              <CustomAutocomplete
                options={datas.countries ?? []}
                label="Occupation Country"
                name="occupation_country"
                value={formData.occupation_country}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={datas.states || []}
                label="Select State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={citySuggestions}
                label="Select City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{ mt: 1, mb: 3, color: "primary.main", fontWeight: 600 }}
          >
            LOGIN DETAILS
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                placeholder="Enter full name"
                sx={{ mb: 3 }}
                value={formData.full_name || ""}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="username"
                sx={{ mb: 3 }}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#334155" }}>
                    Mobile Number(s)
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddMobileNumber}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                      borderRadius: "4px",
                      py: 0.3,
                      px: 1,
                      "&:hover": { borderColor: "primary.dark", backgroundColor: "rgba(112, 15, 43, 0.05)" },
                    }}
                  >
                    Add Mobile
                  </Button>
                </Box>

                {(formData.mobile_numbers && formData.mobile_numbers.length > 0
                  ? formData.mobile_numbers
                  : [formData.mobile_no || ""]
                ).map((mobVal: string, mobIdx: number) => (
                  <Box
                    key={`mob-num-${mobIdx}`}
                    sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}
                  >
                    <TextField
                      fullWidth
                      label={mobIdx === 0 ? "Mobile Number" : `Additional Mobile ${mobIdx}`}
                      type="text"
                      placeholder="10-digit mobile number"
                      value={mobVal}
                      onChange={(e) => handleMobileNumberChange(mobIdx, e.target.value)}
                      required={mobIdx === 0}
                      inputProps={{
                        maxLength: 10,
                        pattern: "[0-9]*",
                      }}
                      error={Boolean(mobVal && !/^[0-9]{10}$/.test(mobVal))}
                      helperText={
                        mobVal && !/^[0-9]{10}$/.test(mobVal)
                          ? "Please enter a valid 10-digit mobile number"
                          : ""
                      }
                    />
                    {mobIdx > 0 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveMobileNumber(mobIdx)}
                        title="Remove Number"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Sponsor / Referral Code Field */}
          <Box sx={{ width: "100%", mt: 1, mb: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TextField
                fullWidth
                label="Referral / Sponsor Code"
                name="refered_by"
                value={sponsor.code}
                onChange={(e) => sponsor.setCode(e.target.value)}
                disabled={sponsor.isLocked}
                placeholder="e.g. PROMO100"
                helperText={
                  sponsor.isLocked && sponsor.isAutoPopulated
                    ? "Referral code auto-applied and locked from referral link"
                    : sponsor.error
                    ? sponsor.error
                    : "Enter an authorized community referral or sponsor code (optional)"
                }
                error={Boolean(sponsor.error)}
                InputProps={{
                  startAdornment: sponsor.isLocked ? (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#D97706", fontSize: 20 }} />
                    </InputAdornment>
                  ) : undefined,
                  endAdornment: sponsor.isVerified ? (
                    <InputAdornment position="end">
                      <CheckCircle sx={{ color: "#16a34a", fontSize: 22 }} />
                    </InputAdornment>
                  ) : undefined,
                }}
              />

              {!sponsor.isLocked && (
                <Button
                  variant="contained"
                  onClick={() => sponsor.verifyCode()}
                  disabled={sponsor.isVerifying || !sponsor.code.trim()}
                  sx={{
                    height: 56,
                    px: 3,
                    whiteSpace: "nowrap",
                    backgroundColor: "#881337",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#70102e" },
                  }}
                >
                  {sponsor.isVerifying ? <CircularProgress size={20} color="inherit" /> : "Verify"}
                </Button>
              )}
            </Box>

            {/* Verified sponsor banner */}
            {sponsor.isVerified && sponsor.promoterName && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.25,
                  borderRadius: "6px",
                  backgroundColor: "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CheckCircle sx={{ color: "#16a34a", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600 }}>
                  Verified Sponsor: {sponsor.promoterName}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Mandatory DPDP Act 2023 Consent Checkbox */}
          <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                  sx={{
                    color: "#881337",
                    "&.Mui-checked": { color: "#881337" },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#881337", fontWeight: 600, textDecoration: "underline" }}
                  >
                    Terms & Conditions
                  </a>{" "}
                  and affirm my matrimonial eligibility. I consent to my personal data being processed under the{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#881337", fontWeight: 600, textDecoration: "underline" }}
                  >
                    Privacy Policy (DPDP Act 2023 compliant)
                  </a>{" "}
                  and{" "}
                  <a
                    href="/data-disclosure"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#881337", fontWeight: 600, textDecoration: "underline" }}
                  >
                    Data Collection Disclosure
                  </a>.
                </Typography>
              }
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexDirection: isMobile ? "row" : "row",
            }}
          >
            <input type="hidden" name="user_role" value={formData.user_role} />
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleClear}
              sx={{
                fontWeight: 600,
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
                color: "#881337",
                borderColor: "#881337",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#70102e",
                  backgroundColor: "rgba(136, 19, 55, 0.04)",
                },
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending || isProcessingPayment || !agreedToTerms}
              sx={{
                backgroundColor: "#881337",
                "&:hover": { backgroundColor: "#70102e" },
                fontWeight: 600,
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
                borderRadius: "8px",
                opacity: agreedToTerms ? 1 : 0.6,
              }}
            >
              {isProcessingPayment ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: 'primary.main' }}>Confirm Payment</DialogTitle>
        <DialogContent>
          {/* Plan Summary */}
          <Box sx={{ mb: 2, p: 2, bgcolor: '#fff1f2', borderRadius: 2, border: '1px solid rgba(136, 19, 55, 0.2)' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Selected Plan</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5, display: "flex", alignItems: "center", gap: 0.75 }}>
              {planType === "PremiumUser" ? (
                <>
                  <Star sx={{ color: "#D97706", fontSize: 22 }} /> Premium Membership
                </>
              ) : (
                <>
                  <WorkspacePremium sx={{ color: "#6B7280", fontSize: 22 }} /> Silver Membership
                </>
              )}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Original Price</Typography>
              <Typography variant="body2" sx={{ textDecoration: isPromoApplied ? 'line-through' : 'none', color: 'text.secondary' }}>
                ₹{originalPrice}
              </Typography>
            </Box>

            {isPromoApplied && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="success.main">Promo Discount ({promocode})</Typography>
                <Typography variant="body2" color="success.main">- ₹100</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #d0e4f7' }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Total Payable</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#27ae60', fontSize: '1.1rem' }}>
                ₹{discountedPrice}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            After payment, you will be redirected back. Your account will be activated after successful payment and admin verification.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} variant="outlined" fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handlePaymentConfirm}
            variant="contained"
            fullWidth
            sx={{ fontWeight: 600, bgcolor: "#881337", "&:hover": { backgroundColor: "#70102e" }, borderRadius: "8px" }}
          >
            Pay ₹{discountedPrice}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Promocode Dialog */}
      <Dialog open={promoDialogOpen} onClose={handleClosePromoDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          Apply Promocode
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your promocode to get ₹100 discount on your membership plan.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Promocode"
            fullWidth
            variant="outlined"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value)}
            disabled={checkPromocodeMutation.isPending}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClosePromoDialog}
            disabled={checkPromocodeMutation.isPending}
            sx={{ borderRadius: "8px", borderColor: "#881337", color: "#881337" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyPromocode}
            disabled={!promocode.trim() || checkPromocodeMutation.isPending}
            startIcon={
              checkPromocodeMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              minWidth: 120,
              borderRadius: "8px",
              backgroundColor: "#881337",
              "&:hover": {
                backgroundColor: "#70102e",
              },
            }}
          >
            {checkPromocodeMutation.isPending ? "Checking..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;