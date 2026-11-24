import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
// Cashfree JS SDK v3 is loaded via <script> tag in index.html (window.Cashfree)
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
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LockIcon from "@mui/icons-material/Lock";
import { Add as AddIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { toast } from "react-toastify";
import { useSignupMutation } from "../api/Auth";
import { post } from "../api/authHooks";
import { useLocation, Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingComponent } from "../../App";
import CustomAutocomplete from "../Autocomplete/CustomAutocomplete";
import useSponsorCode from "../../hooks/useSponsorCode";
import SEOHead from "../common/SEOHead";

declare global {
  interface Window {
    Cashfree: any;
  }
}

const datas: any = (rawJsonData as any[]).reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

const Register = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mutate, isPending } = useSignupMutation();
  const searchParams = new URLSearchParams(location.search);
  const planType = searchParams.get("type");

  const getInitialRefCode = () => {
    try {
      const params = new URLSearchParams(window?.location?.search || "");
      return (
        params.get("ref") ||
        params.get("promo") ||
        params.get("refered_by") ||
        ""
      ).trim().toUpperCase();
    } catch {
      return "";
    }
  };

  const [citySuggestions, setCitySuggestions] = useState(datas.cities || []);
  const [talukSuggestions, setTalukSuggestions] = useState([]);

  const getUserRole = useCallback(() => {
    switch (planType) {
      case "PremiumUser":
        return "PremiumUser";
      case "SilverUser":
        return "SilverUser";
      default:
        return "FreeUser";
    }
  }, [planType]);

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
    district: "",
    taluk: "",
    city: "",
    full_name: "",
    first_name: "",
    last_name: "",
    username: "",
    mobile_no: "",
    mobile_numbers: [""],
    password: "",
    confirmPassword: "",
    refered_by: getInitialRefCode(),
    refered_name: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [agreeConsent, setAgreeConsent] = useState(false);

  const {
    sponsorState,
    isValidating: isValidatingPromoter,
    setCode: setSponsorCode,
    handleManualVerify,
    resetIfNotLocked,
  } = useSponsorCode();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      refered_by: sponsorState.code,
      refered_name: sponsorState.promoterName,
    }));
  }, [sponsorState.code, sponsorState.promoterName]);

  // Determine display amount for selected plan
  const getPlanAmount = () => {
    switch (planType) {
      case "PremiumUser":
        return 1499;
      case "SilverUser":
        return 999;
      default:
        return 0;
    }
  };
  const displayAmount = getPlanAmount();

  useEffect(() => {
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

    if (name === "refered_by") {
      setSponsorCode(value);
      return;
    }

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
    setFormData({
      ...initialFormState,
      refered_by: sponsorState.isLocked ? sponsorState.code : "",
      refered_name: sponsorState.isLocked ? sponsorState.promoterName : "",
    });
    resetIfNotLocked();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreeConsent) {
      toast.error("Please accept the Terms & Conditions and Privacy Policy to register");
      return;
    }

    // --- Field Validation ---
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
    if (!formData.username?.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
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
    };

    const planName = getUserRole();
    let amount = 0;
    if (planName === "PremiumUser") amount = 1499;
    else if (planName === "SilverUser") amount = 999;

    // --- Free User: Register directly ---
    if (amount === 0) {
      mutate(submissionData);
      return;
    }

    // --- Paid User: Create order → Open Cashfree Checkout ---
    (async () => {
      try {
        setIsProcessingPayment(true);

        // Guard: Make sure Cashfree SDK is loaded (from index.html CDN script)
        if (typeof window.Cashfree !== "function") {
          toast.error(
            "Payment SDK not loaded. Please check your internet connection and refresh the page."
          );
          return;
        }

        const orderId = `REG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const BACKEND_URL = import.meta.env.VITE_API_URL || "";

        const payload = {
          orderId,
          orderAmount: amount,
          customerName: formData.full_name.trim(),
          customerEmail: formData.username.trim().toLowerCase(),
          customerPhone: primaryMobile,
          planType: planName,
          context: "registration",
          originalAmount: amount,
        };

        const resp = await axios.post(`${BACKEND_URL}/api/payment/create-order`, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        });

        const data = resp.data || {};
        const sessionId = data.payment_session_id;
        const cashfreeEnv = data.cashfree_env === "production" ? "production" : "sandbox";

        if (!sessionId) {
          toast.error("Could not initiate payment. Please try again.");
          return;
        }

        // Open Cashfree hosted checkout page
        const cashfree = window.Cashfree({ mode: cashfreeEnv });
        cashfree.checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_self", // redirects back to return_url after payment
        });

      } catch (err) {
        console.error("Payment error:", err);
        const message =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to start payment. Please try again.";
        toast.error(message);
      } finally {
        setIsProcessingPayment(false);
      }
    })();
  };


  const isValidAge = (value) => {
    if (value === "") return true; // Allow empty field
    return /^\d+$/.test(value); // Check if it's only digits
  };

  return (
    <>
      <SEOHead
        title="Register"
        description="Register with Sangam Sathi to discover verified matrimonial matches within your community."
        canonicalUrl="https://sangamsathi.com/register"
      />
      <Navbar />
      {isPending && <LoadingComponent />}
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: { xs: 1, sm: 2 },
          mt: "10px",
          width: isMobile ? "100%" : "88%",
          display: "flex",
          justifyContent: "center",
          justifySelf: "center",
          background: "#F8FAFC", border: "1px solid rgba(11,25,44,0.08)",
          borderRadius: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 4, md: 5 },
            borderRadius: 3,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: "100%",
              pb: 2,
              borderBottom: "2px solid",
              borderColor: "rgba(11,25,44,0.12)",
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
              <Avatar sx={{ bgcolor: "#0B192C" }}>
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

            {displayAmount > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  background: "linear-gradient(135deg, #0B192C, #1A365D)",
                  color: "#fff",
                  py: 1,
                  px: 2.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: { xs: "14px", sm: "16px" },
                  boxShadow: "0 4px 14px rgba(11,25,44,0.25)",
                }}
              >
                <Box component="span" sx={{ opacity: 0.85, fontSize: "13px" }}>Plan:</Box>
                {getUserRole()}
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    background: "rgba(255,255,255,0.2)",
                    px: 1.5,
                    py: 0.3,
                    borderRadius: 1,
                    fontSize: "14px",
                  }}
                >
                  ₹{displayAmount}
                </Box>
              </Box>
            )}
            {displayAmount === 0 && (
              <Box
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#555",
                  py: 0.5,
                  px: 2,
                  borderRadius: 2,
                  fontWeight: 500,
                  border: "1px solid rgba(11,25,44,0.12)",
                  background: "rgba(11,25,44,0.02)",
                }}
              >
                Plan: <Box component="span" sx={{ color: "#0B192C", fontWeight: 600 }}>Free</Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mt: 3,
            }}
          >
            <Box
              sx={{
                flex: 1,
                background: "#fff",
                borderRadius: 3,
                p: { xs: 2, sm: 3 },
                boxShadow: "0 2px 16px rgba(11,25,44,0.08)",
                border: "1px solid rgba(11,25,44,0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: "#0B192C",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&::after": {
                    content: '""',
                    flex: 1,
                    height: "1px",
                    background: "rgba(11,25,44,0.12)",
                    ml: 1,
                  },
                }}
              >
                Personal Details
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
                required
                InputLabelProps={{ shrink: !!formData.age }}
                error={!isValidAge(formData.age)} // Show error state if not valid
                helperText={
                  !isValidAge(formData.age) ? "Please enter a valid number" : ""
                }
              />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#0B192C", fontWeight: 600 }}
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                background: "#fff",
                borderRadius: 3,
                p: { xs: 2, sm: 3 },
                boxShadow: "0 2px 16px rgba(11,25,44,0.08)",
                border: "1px solid rgba(11,25,44,0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: "#0B192C",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&::after": {
                    content: '""',
                    flex: 1,
                    height: "1px",
                    background: "rgba(11,25,44,0.12)",
                    ml: 1,
                  },
                }}
              >
                Family Details
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
                      borderColor: "#0F172A",
                      color: "#0F172A",
                      borderRadius: "4px",
                      py: 0.4,
                      px: 1.2,
                      "&:hover": { borderColor: "#020617", backgroundColor: "rgba(15, 23, 42, 0.05)" },
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
                required
              />

              <CustomAutocomplete
                options={datas.casteValues ?? []}
                label="Caste"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                required
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
                required
              />

              <CustomAutocomplete
                options={datas.countries ?? []}
                label="Occupation Country"
                name="occupation_country"
                value={formData.occupation_country}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={datas.states || []}
                label="Select State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={citySuggestions}
                label="Select City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mb: 2.5,
              color: "#0B192C",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&::after": {
                content: '""',
                flex: 1,
                height: "1px",
                background: "rgba(11,25,44,0.12)",
                ml: 1,
              },
            }}
          >
            Login Details
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
                      borderColor: "#0F172A",
                      color: "#0F172A",
                      borderRadius: "4px",
                      py: 0.3,
                      px: 1,
                      "&:hover": { borderColor: "#020617", backgroundColor: "rgba(15, 23, 42, 0.05)" },
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
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Sponsor Code and Sponsor Name Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                Sponsor Code: {sponsorState.isLocked && <span style={{ color: '#D4AF37', fontSize: '0.8rem', marginLeft: '6px' }}>(Locked)</span>}
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  name="refered_by"
                  value={sponsorState.code}
                  disabled={sponsorState.isLocked}
                  onChange={(e) => setSponsorCode(e.target.value)}
                  placeholder="Promoter ID / Sponsor Code"
                  inputProps={{ maxLength: 8 }}
                  InputProps={{
                    endAdornment: sponsorState.isLocked ? (
                      <LockIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    ) : null,
                  }}
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleManualVerify}
                  disabled={isValidatingPromoter || sponsorState.isLocked || !sponsorState.code}
                  sx={{
                    bgcolor: "#0B192C",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#1A365D" },
                    textTransform: "none",
                    minWidth: "85px",
                    borderRadius: "4px",
                  }}
                >
                  {isValidatingPromoter ? "..." : "Verify"}
                </Button>
              </Box>
              {sponsorState.error && (
                <Typography variant="caption" sx={{ color: "#d32f2f", fontWeight: 600, display: "block", mt: 0.5 }}>
                  ✖ {sponsorState.error}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                Sponsor Name:
              </Typography>
              <TextField
                fullWidth
                name="refered_name"
                value={sponsorState.promoterName || ""}
                placeholder="Sponsor Name (Auto-filled on verify)"
                InputProps={{
                  readOnly: true,
                  startAdornment: sponsorState.promoterName ? (
                    <span style={{ color: "#2e7d32", fontWeight: "bold", marginRight: "8px" }}>✔</span>
                  ) : null
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: sponsorState.promoterName ? "#edf7ed !important" : "#ffffff !important",
                    "& input": {
                      color: sponsorState.promoterName ? "#1e4620 !important" : "#555 !important",
                      fontWeight: sponsorState.promoterName ? 600 : 400
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Form Consent Checkbox */}
          <Box sx={{ width: "100%", mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeConsent}
                  onChange={(e) => setAgreeConsent(e.target.checked)}
                  sx={{ color: "#0B192C", "&.Mui-checked": { color: "#0B192C" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#334155", fontSize: "0.88rem" }}>
                  I agree to the{" "}
                  <Link to="/terms" style={{ color: "#0B192C", fontWeight: 600 }} target="_blank">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" style={{ color: "#0B192C", fontWeight: 600 }} target="_blank">
                    Privacy Policy
                  </Link>{" "}.
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
                color: "#000",
                border: '1px solid #0B192C',
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#0B192C",
                  color: "#fff",
                },
              }}
            >
              Clear
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending || isProcessingPayment}
              sx={{
                background: isPending || isProcessingPayment
                  ? "#ccc"
                  : "linear-gradient(135deg, #0B192C 0%, #1A365D 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1A365D 0%, #0B192C 100%)",
                  boxShadow: "0 6px 20px rgba(11,25,44,0.3)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.25s ease",
                color: "white",
                fontWeight: 700,
                letterSpacing: "0.5px",
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
                borderRadius: 2,
              }}
            >
              {isProcessingPayment ? 'Redirecting to Payment...' : displayAmount > 0 ? `Pay ₹${displayAmount}` : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Register;
