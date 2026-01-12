import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../utils/api/authAPI";

const useSignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

const validateForm = () => {
  const newErrors = {
    confirmPassword: ''
  };
  let isValid = true;

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
    isValid = false;
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid";
    isValid = false;
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);


        const res = await authAPI.register(formData);

        if (res.success) {
            navigate("/signin");
        }

        setIsLoading(false);
    };

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit
    };
};

export default useSignUp;
