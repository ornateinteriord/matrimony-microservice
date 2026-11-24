import { useEffect, useState, useCallback, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CloseIcon from "@mui/icons-material/Close";
import { Add as AddIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";
import Navbar from "../navbar/Navbar";
import "./Register.scss";
import PaymentSuccessScanner from "../common/PaymentSuccessScanner";
import ScannerImg from "../../assets/Scanner.jpeg";

import { toast } from "react-toastify";
import { useSignupMutation } from "../api/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingComponent } from "../../App";
import CustomAutocomplete from "../Autocomplete/CustomAutocomplete";
import TokenService from "../token/tokenService";
import { post } from "../api/authHooks";

const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
        params.get("sponsor") ||
        params.get("refered_by") ||
        ""
      ).trim().toUpperCase();
    } catch {
      return "";
    }
  };

  const initialUrlSponsor = getInitialRefCode();
  const [isSponsorLocked, setIsSponsorLocked] = useState<boolean>(Boolean(initialUrlSponsor));
  const [isSponsorVerified, setIsSponsorVerified] = useState<boolean>(Boolean(initialUrlSponsor));

  const [showScanner, setShowScanner] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [signupResponse, setSignupResponse] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const [citySuggestions, setCitySuggestions] = useState(datas.cities || []);
  const [talukSuggestions, setTalukSuggestions] = useState([]);

  const getUserRole = () => {
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
    father_contact: "",
    mother_contact: "",
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
    refered_by: getInitialRefCode(),
    refered_name: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [promoterName, setPromoterName] = useState("");
  const [promoterError, setPromoterError] = useState("");
  const [isValidatingPromoter, setIsValidatingPromoter] = useState(false);
  const verifiedCodeRef = useRef("");

  const verifyCode = useCallback(async (codeToVerify) => {
    if (!codeToVerify || verifiedCodeRef.current === codeToVerify) return;
    verifiedCodeRef.current = codeToVerify;
    setIsValidatingPromoter(true);
    setPromoterError("");
    try {
      const response = await post("/api/promoter/promocheck", { promocode: codeToVerify });
      if (response?.success && response?.data?.promoterName) {
        setPromoterName(response.data.promoterName);
        setFormData((prev) => ({
          ...prev,
          refered_by: codeToVerify,
          refered_name: response.data.promoterName,
        }));
        toast.success(`Sponsor Code applied: ${codeToVerify} (${response.data.promoterName})`, {
          toastId: "sponsor-applied-toast",
        });
      } else {
        setPromoterError(response?.message || "Invalid Sponsor Code");
      }
    } catch (error) {
      console.error("Auto verify sponsor error:", error);
      const msg = error?.response?.data?.message || "Invalid Sponsor Code or inactive promoter";
      setPromoterError(msg);
    } finally {
      setIsValidatingPromoter(false);
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, user_role: getUserRole() }));
  }, [planType]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = (
      params.get("ref") ||
      params.get("promo") ||
      params.get("sponsor") ||
      params.get("refered_by") ||
      getInitialRefCode()
    ).trim().toUpperCase();

    if (code) {
      setFormData((prev) => ({ ...prev, refered_by: code }));
      setIsSponsorLocked(true);
      setIsSponsorVerified(true);
      verifyCode(code);
    }
  }, [location.search, verifyCode]);

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
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }
    if (name === "mobile_no") {
      if (value === "" || /^\d{0,10}$/.test(value)) {
        setFormData((prev) => {
          const numbers = [...(prev.mobile_numbers || [""])];
          numbers[0] = value;
          return { ...prev, mobile_no: value, mobile_numbers: numbers };
        });
      }
      return;
    }
    if (name === "full_name") {
      const parts = value.trim().split(/\s+/);
      setFormData((prev) => ({
        ...prev,
        full_name: value,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
      }));
      return;
    }
    if (name === "father_contact" || name === "mother_contact") {
      if (value === "" || /^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    if (name === "date_of_birth") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, [name]: value, age: age.toString() }));
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

  const handleMobileNumberChange = (index, value) => {
    if (value === "" || /^\d{0,10}$/.test(value)) {
      setFormData((prev) => {
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
    setFormData((prev) => ({
      ...prev,
      mobile_numbers: [...(prev.mobile_numbers || [prev.mobile_no || ""]), ""],
    }));
  };

  const handleRemoveMobileNumber = (index) => {
    setFormData((prev) => {
      const numbers = (prev.mobile_numbers || [""]).filter((_, i) => i !== index);
      const finalNumbers = numbers.length > 0 ? numbers : [""];
      return {
        ...prev,
        mobile_numbers: finalNumbers,
        mobile_no: finalNumbers[0] || "",
      };
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleVerifyPromoter = async () => {
    const code = formData.refered_by?.trim().toUpperCase();
    if (code !== formData.refered_by) {
      setFormData((prev) => ({ ...prev, refered_by: code || "" }));
    }
    if (!code) {
      setPromoterError("Please enter a Sponsor Code first");
      setPromoterName("");
      return;
    }
    setIsValidatingPromoter(true);
    setPromoterError("");
    setPromoterName("");
    setFormData((prev) => ({ ...prev, refered_name: "" }));
    try {
      const response = await post("/api/promoter/promocheck", { promocode: code });
      if (response?.success && response?.data?.promoterName) {
        setPromoterName(response.data.promoterName);
        setFormData((prev) => ({ ...prev, refered_name: response.data.promoterName }));
        setIsSponsorLocked(true);
        setIsSponsorVerified(true);
        toast.success(`Sponsor verified: ${response.data.promoterName}`);
      } else {
        setIsSponsorLocked(false);
        setIsSponsorVerified(false);
        setPromoterError(response?.message || "Invalid promocode. Please check and try again.");
        toast.error(response?.message || "Invalid promocode. Please check and try again.");
      }
    } catch (error) {
      setIsSponsorLocked(false);
      setIsSponsorVerified(false);
      const msg = error?.response?.data?.message || "Invalid promocode. Please check and try again.";
      setPromoterError(msg);
      toast.error(msg);
    } finally {
      setIsValidatingPromoter(false);
    }
  };

  const handleClear = () => {
    if (isSponsorLocked) {
      const code = formData.refered_by;
      const refName = formData.refered_name;
      setFormData({
        ...initialFormState,
        refered_by: code,
        refered_name: refName,
      });
    } else {
      setFormData(initialFormState);
      setPromoterName("");
      setIsSponsorLocked(false);
      setIsSponsorVerified(false);
    }
    setPromoterError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name?.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    const primaryMobile = (formData.mobile_numbers?.[0] || formData.mobile_no || "").trim();
    if (!/^[0-9]{10}$/.test(primaryMobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
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

    if (formData.father_contact && !/^[0-9]{10}$/.test(formData.father_contact.trim())) {
      toast.error("Father's contact must be a valid 10-digit number");
      return;
    }

    if (formData.mother_contact && !/^[0-9]{10}$/.test(formData.mother_contact.trim())) {
      toast.error("Mother's contact must be a valid 10-digit number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const nameParts = formData.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const validMobileNumbers = (formData.mobile_numbers || [primaryMobile]).map((n) => n.trim()).filter(Boolean);

    const submissionData = {
      ...formData,
      full_name: formData.full_name.trim(),
      fullname: formData.full_name.trim(),
      first_name: firstName,
      last_name: lastName,
      mobile_no: primaryMobile,
      mobile_numbers: validMobileNumbers,
      parents: [
        { relation: "Father", name: formData.name_of_parent === "Father" ? formData.parent_name : "", contact: formData.father_contact || "" },
        { relation: "Mother", name: formData.name_of_parent === "Mother" ? formData.parent_name : "", contact: formData.mother_contact || "" }
      ]
    };

    try {
      mutate(submissionData, {
        onSuccess: (response) => {
          if (response.success) {
            setSignupResponse(response);
            if (formData.user_role === "PremiumUser" || formData.user_role === "SilverUser") {
              setShowScanner(true);
            } else {
              setShowSuccessDialog(true);
            }
          } else {
            console.error(response.message);
            toast.error(response.message);
          }
        },
        onError: (error) => {
          console.error("Signup error:", error);
          toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleScannerSubmit = () => {
    setShowScanner(false);
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate("/home");
  };

  const isValidAge = (value) => {
    if (value === "") return true;
    return /^\d+$/.test(value);
  };

  return (
    <>
      <Navbar />
      {isPending && <LoadingComponent />}
      <div className="register-page-container" style={{ backgroundImage: `url('/hero-background.jpg')` }}>
        <div className="branding-section">
          <h1>Shreeganda <span>MATRIMONY</span></h1>
          <p className="tagline">Uniting Hearts, Creating Bonds</p>
        </div>

        <div className="register-form-wrapper">
          <div className="form-header">
            <h2>Create Your Profile</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* LEFT COLUMN - Personal, Social & Career */}
              <div className="form-column">
                <div className="form-row">
                  <div className="label-col">Profile For:</div>
                  <div className="input-col">
                    <Select fullWidth name="profilefor" value={formData.profilefor} onChange={handleChange} className="mui-input-custom" displayEmpty>
                      <MenuItem value="" disabled>Profile Created by:</MenuItem>
                      <MenuItem value="Self">Self</MenuItem>
                      <MenuItem value="Son">Son</MenuItem>
                      <MenuItem value="Daughter">Daughter</MenuItem>
                      <MenuItem value="Brother">Brother</MenuItem>
                      <MenuItem value="Sister">Sister</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Gender:</div>
                  <div className="input-col">
                    <Select fullWidth name="gender" value={formData.gender} onChange={handleChange} className="mui-input-custom" displayEmpty>
                      <MenuItem value="" disabled>Select Gender</MenuItem>
                      <MenuItem value="BrideGroom">Male</MenuItem>
                      <MenuItem value="Bride">Female</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Marital Status:</div>
                  <div className="input-col">
                    <Select fullWidth name="marital_status" value={formData.marital_status} onChange={handleChange} className="mui-input-custom" displayEmpty>
                      <MenuItem value="" disabled>Marital Status</MenuItem>
                      {datas.marritalStatus?.map((item, idx) => (
                        <MenuItem key={idx} value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Religion:</div>
                  <div className="input-col">
                    <Select fullWidth name="religion" value={formData.religion} onChange={handleChange} className="mui-input-custom">
                      <MenuItem value="Hindu">Hindu</MenuItem>
                      <MenuItem value="Muslim">Muslim</MenuItem>
                      <MenuItem value="Christian">Christian</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Caste:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.casteValues ?? []} label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Date of Birth:</div>
                  <div className="input-col">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                        onChange={(newValue) => {
                          const dob = newValue ? newValue.toISOString().split("T")[0] : "";
                          const age = dob ? calculateAge(dob) : "";
                          setFormData((prev) => ({ ...prev, date_of_birth: dob, age: age.toString() }));
                        }}
                        maxDate={dayjs()}
                        slotProps={{ textField: { fullWidth: true, required: true, className: "mui-input-custom" } }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Age:</div>
                  <div className="input-col">
                    <TextField fullWidth name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="mui-input-custom" InputLabelProps={{ shrink: !!formData.age }} error={!isValidAge(formData.age)} helperText={!isValidAge(formData.age) ? "Please enter a valid number" : ""} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Education:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.qualificationValues ?? []} label="Educational Qualification" name="educational_qualification" value={formData.educational_qualification} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Occupation:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.occupationValues ?? []} label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Income/Annum:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.incomeValues ?? []} label="Income Per Annum" name="income_per_month" value={formData.income_per_month} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Country:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.countries ?? []} label="Country" name="country" value={formData.country} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Mother Tongue:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.languageValues ?? []} label="Mother Tongue" name="mother_tongue" value={formData.mother_tongue} onChange={handleChange} />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - Family, Address & Login Details */}
              <div className="form-column">
                <div className="form-row">
                  <div className="label-col">Select Parents:</div>
                  <div className="input-col">
                    <Select fullWidth name="name_of_parent" value={formData.name_of_parent} onChange={handleChange} className="mui-input-custom" displayEmpty>
                      <MenuItem value="" disabled>Select Parents</MenuItem>
                      <MenuItem value="Father">Father</MenuItem>
                      <MenuItem value="Mother">Mother</MenuItem>
                      <MenuItem value="Guardian">Guardian</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Parent Name:</div>
                  <div className="input-col">
                    <TextField fullWidth name="parent_name" value={formData.parent_name} onChange={handleChange} placeholder="Parent / Guardian Name" className="mui-input-custom" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Father Contact:</div>
                  <div className="input-col">
                    <TextField fullWidth name="father_contact" value={formData.father_contact || ""} onChange={handleChange} placeholder="Father's Contact (Optional)" className="mui-input-custom" inputProps={{ maxLength: 10, pattern: "[0-9]*" }} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Mother Contact:</div>
                  <div className="input-col">
                    <TextField fullWidth name="mother_contact" value={formData.mother_contact || ""} onChange={handleChange} placeholder="Mother's Contact (Optional)" className="mui-input-custom" inputProps={{ maxLength: 10, pattern: "[0-9]*" }} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Address:</div>
                  <div className="input-col">
                    <TextField fullWidth name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="mui-input-custom" multiline rows={2} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Occ. Country:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.countries ?? []} label="Occupation Country" name="occupation_country" value={formData.occupation_country} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">State:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={datas.states || []} label="Select State" name="state" value={formData.state} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">City:</div>
                  <div className="input-col">
                    <CustomAutocomplete options={citySuggestions} label="Select City" name="city" value={formData.city} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Full Name:</div>
                  <div className="input-col">
                    <TextField fullWidth name="full_name" value={formData.full_name || ""} onChange={handleChange} placeholder="Full Name" className="mui-input-custom" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Mobile Numbers:</div>
                  <div className="input-col">
                    {(formData.mobile_numbers && formData.mobile_numbers.length > 0 ? formData.mobile_numbers : [formData.mobile_no || ""]).map((mobVal, mobIdx) => (
                      <Box key={`mob-num-${mobIdx}`} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                        <TextField
                          fullWidth
                          name={mobIdx === 0 ? "mobile_no" : `mobile_no_${mobIdx}`}
                          value={mobVal}
                          onChange={(e) => handleMobileNumberChange(mobIdx, e.target.value)}
                          placeholder={mobIdx === 0 ? "Primary Mobile Number" : `Alternate Mobile ${mobIdx}`}
                          className="mui-input-custom"
                          required={mobIdx === 0}
                          inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                          error={Boolean(mobVal && !/^[0-9]{10}$/.test(mobVal))}
                          helperText={mobVal && !/^[0-9]{10}$/.test(mobVal) ? "10-digit number required" : ""}
                        />
                        {mobIdx === 0 ? (
                          <IconButton
                            size="small"
                            onClick={handleAddMobileNumber}
                            title="Add another mobile number"
                            sx={{ bgcolor: "#0B192C", color: "#fff", "&:hover": { bgcolor: "#1A365D" }, borderRadius: "4px", p: "6px" }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveMobileNumber(mobIdx)}
                            title="Remove number"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Email:</div>
                  <div className="input-col">
                    <TextField fullWidth type="email" name="username" value={formData.username} onChange={handleChange} placeholder="Email ID" className="mui-input-custom" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Password:</div>
                  <div className="input-col">
                    <TextField fullWidth type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="mui-input-custom" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="label-col">Confirm Pwd:</div>
                  <div className="input-col">
                    <TextField fullWidth type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="mui-input-custom" />
                  </div>
                </div>

              </div>
            </div>

            {/* Dedicated 2-Column Row for Sponsor Code and Sponsor Name */}
            <div className="form-grid" style={{ marginTop: "12px", marginBottom: "8px" }}>
              <div className="form-column">
                <div className="form-row">
                  <div className="label-col">Sponsor Code:</div>
                  <div className="input-col">
                    <Box display="flex" gap={1}>
                      <TextField
                        fullWidth
                        name="refered_by"
                        value={formData.refered_by || ""}
                        onChange={handleChange}
                        placeholder="Promoter ID / Sponsor Code"
                        className="mui-input-custom"
                        inputProps={{ maxLength: 16 }}
                        disabled={isSponsorLocked}
                      />
                      <Button
                        type="button"
                        variant="contained"
                        onClick={handleVerifyPromoter}
                        disabled={isSponsorLocked || isValidatingPromoter || !formData.refered_by}
                        sx={{
                          bgcolor: isSponsorLocked ? "#2e7d32" : "#C5A059",
                          color: "#fff",
                          fontWeight: 700,
                          "&:hover": { bgcolor: isSponsorLocked ? "#2e7d32" : "#b38c45" },
                          textTransform: "none",
                          minWidth: "85px",
                          borderRadius: "6px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                        }}
                      >
                        {isSponsorLocked ? "Locked" : isValidatingPromoter ? "..." : "Verify"}
                      </Button>
                    </Box>
                    {isSponsorLocked && (
                      <Typography variant="caption" sx={{ color: "#22c55e", fontWeight: 600, display: "block", mt: 0.5 }}>
                        Sponsor code locked and verified
                      </Typography>
                    )}
                    {promoterError && !isSponsorLocked && (
                      <Typography variant="caption" sx={{ color: "#ffcdd2", fontWeight: 600, display: "block", mt: 0.5 }}>
                        {promoterError}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-column">
                <div className="form-row">
                  <div className="label-col">Sponsor Name:</div>
                  <div className="input-col">
                    <TextField
                      fullWidth
                      name="refered_name"
                      value={promoterName || (isSponsorLocked ? "Verified Partner" : "")}
                      placeholder="Sponsor Name (Auto-filled on verify)"
                      className="mui-input-custom"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: (promoterName || isSponsorLocked) ? "#f0fdf4 !important" : "#ffffff !important",
                          "& input": {
                            color: (promoterName || isSponsorLocked) ? "#166534 !important" : "#555 !important",
                            fontWeight: (promoterName || isSponsorLocked) ? 700 : 400
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="checkbox-row" style={{ marginTop: "12px", marginBottom: "8px" }}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I have read and agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "#8B1E1E", fontWeight: 600 }}>Terms and Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#8B1E1E", fontWeight: 600 }}>Privacy Policy</a>.
              </label>
            </div>

            <div className="checkbox-row" style={{ marginTop: "4px", marginBottom: "16px" }}>
              <input type="checkbox" id="consent" required />
              <label htmlFor="consent">
                I consent to the collection and processing of my personal matrimonial data in compliance with the Digital Personal Data Protection Act 2023 (DPDP Act 2023).
              </label>
            </div>

            <input type="hidden" name="user_role" value={formData.user_role} />

            <div className="submit-btn-row">
              <button type="button" className="register-btn clear-btn" onClick={handleClear}>
                Clear
              </button>
              <button type="submit" className="register-btn" disabled={isPending}>
                Register Now
              </button>
            </div>

            <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: "1px dashed #e5e7eb" }}>
              <Typography variant="body2" sx={{ color: "#eff2f6ff", fontSize: "0.95rem" }}>
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/home", { state: { openDialog: true } })}
                  style={{
                    color: "#51b6f0ff",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginLeft: "4px"
                  }}
                >
                  Sign In
                </span>
              </Typography>
            </Box>
          </form>
        </div>
      </div>

      {/* Payment Scanner Dialog */}
      <PaymentSuccessScanner
        open={showScanner}
        onClose={handleScannerSubmit}
        userType={formData.type_of_user || "Premium"}
        buttonText="Submit"
      />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={handleSuccessClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", color: "#4caf50", fontWeight: "bold", position: "relative" }}>
          Registration Successful!
          <IconButton
            onClick={handleSuccessClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            Thank you for registering with Shreeganda Matrimony. 
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}>
            Your details have been successfully submitted and our team will review them shortly.
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
            If you have any queries, please reach us at: <br />
            <a href="mailto:shreegandamatrimonysupport@gmail.com" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>shreegandamatrimonysupport@gmail.com</a>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button 
            onClick={handleSuccessClose} 
            variant="contained" 
            sx={{
              bgcolor: '#e11d48',
              color: 'white',
              '&:hover': {
                bgcolor: '#c0392b',
                color: 'white',
              }
            }}
          >
            Continue to Website
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;