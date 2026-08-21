import { z } from "zod";

// Prediction Validation
export const PredictionSubmissionSchema = z.object({
  matchId: z.string(),
  gameweekId: z.number().int().min(1).max(38),
  predictedHomeScore: z.number().int().min(0).max(20),
  predictedAwayScore: z.number().int().min(0).max(20),
});

export const BatchPredictionSchema = z.object({
  gameweekId: z.number().int().min(1).max(38),
  predictions: z.array(
    z.object({
      matchId: z.string(),
      predictedHomeScore: z.number().int().min(0).max(20),
      predictedAwayScore: z.number().int().min(0).max(20),
    })
  ),
});

// Auth Validation
export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  favoriteClubId: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// League Validation
export const CreateLeagueSchema = z.object({
  name: z.string().min(3, "League name must be at least 3 characters").max(50),
});

export const JoinLeagueSchema = z.object({
  code: z.string().min(4, "Invalid league code").max(12),
});
