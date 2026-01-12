import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const useSignIn = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  setErrors((prev) => ({ ...prev, [name]: "" }));


   setSubmitError("")
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError("");

      if (!validateForm()) return;

      setIsLoading(true);

      try {
        await login(formData);
      } catch (error) {
        console.error("Login error:", error);
        setSubmitError(
          error?.message || "Login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, login, validateForm]
  );

  return {
    formData,
    errors,
    isLoading,
    submitError,
    handleChange,
    handleSubmit
  };
};

export default useSignIn;
