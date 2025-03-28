const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.number().min(18, "Must be at least 18 years old"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed", "Other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
  gender: z.enum(["Male", "Female", "Other"]),
  verificationIdNo: z.string().min(5, "Verification ID must be at least 5 characters").max(20, "Verification ID cannot exceed 20 characters"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
  preferredLocation: z.string().min(1, "Preferred location is required"),
  budget: z.number().min(1, "Budget must be a positive number"),
  leaseDuration: z.enum(["1-3 months", "3-6 months", "6-12 months", "12+ months"]),
  preferredTenantType: z.enum(["Student", "Working Professional", "Family", "Any"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };