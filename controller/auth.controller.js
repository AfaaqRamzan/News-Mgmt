import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/auth.validation.js";
import bcrypt from "bcryptjs";
import { prisma } from "../DB/db.config.js";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.create(registerSchema)
            const payload = await validator.validate(body)

            // * Check if the email is already in use
            const existingUser = await prisma.user.findUnique({ where: { email: payload.email } })
            if (existingUser) {
                return res.status(400).json({ errors: "Email already in use. Please use a different email." })
            }

            // * Encrypt the password
            const encryptedPassword = bcrypt.hashSync(payload.password, 10);
            if (!encryptedPassword) {
                return res.status(500).json({ errors: "Failed to encrypt password. Please try again later." })
            }

            // * Create a new user
            const newUser = await prisma.user.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password: encryptedPassword
                }
            })
            return res.status(201).json({ message: "User created successfully", newUser });
        } catch (error) {
            console.log("The error is", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                // * 400 Bad Request
                return res.status(400).json({ errors: error.messages })
            }
            return res.status(500).json({ message: "Internal server error. Please try again later." })
        }
    }
}

export default AuthController;