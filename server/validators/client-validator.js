const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Other"]),
  verificationIdNo: z.string().min(1, "Verification ID number is required"),
  preference: z.enum(["Student", "Working Professional"]),
  age: z.number().min(18, "Must be at least 18 years old"),
  gender: z.enum(["Male", "Female", "Other"]),
  leaseDuration: z.enum(["1-3 months", "3-6 months", "6-12 months", "12+ months"]),
  budget: z.number().min(1, "Budget must be a positive number"),
  preferredLocation: z.string().min(1, "Preferred location is required"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  lifestyle: z.object({
    sleepSchedule: z.enum(["Early Bird", "Night Owl"]).optional(),
    cleanliness: z.number().min(1).max(5).optional(),
    smoking: z.boolean().optional(),
    pets: z.boolean().optional(),
  }).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };