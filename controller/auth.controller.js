import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import bcrypt from "bcryptjs";
import { prisma } from "../DB/db.config.js";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    /*  #swagger.tags = ['Auth']
            #swagger.summary = 'Register a new user'
            #swagger.description = 'Creates a new user account after validating the name, email, password, and password confirmation.'
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'User registration info',
                required: true,
                schema: {
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'password123',
                    password_confirmation: 'password123'
                }
            }
            #swagger.responses[201] = {
                description: 'User created successfully',
                schema: {
                    message: 'User created successfully',
                    newUser: {
                        id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
                        name: 'John Doe',
                        email: 'johndoe@example.com',
                        createdAt: '2026-07-16T12:00:00.000Z',
                        updatedAt: '2026-07-16T12:00:00.000Z'
                    }
                }
            }
            #swagger.responses[400] = {
                description: 'Validation failed or email already in use',
                schema: {
                    errors: {
                        email: 'The email field must be a valid email address'
                    }
                }
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const body = req.body;
      const validator = vine.create(registerSchema);
      const payload = await validator.validate(body);

      // * Check if the email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (existingUser) {
        return res.status(400).json({
          errors: "Email already in use. Please use a different email.",
        });
      }

      // * Encrypt the password
      const encryptedPassword = bcrypt.hashSync(payload.password, 10);
      if (!encryptedPassword) {
        return res.status(500).json({
          errors: "Failed to encrypt password. Please try again later.",
        });
      }

      // * Create a new user
      const newUser = await prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: encryptedPassword,
        },
      });
      return res
        .status(201)
        .json({ message: "User created successfully", newUser });
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // * 400 Bad Request
        return res.status(400).json({ errors: error.messages });
      }
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }

  static async login(req, res) {
    /*  #swagger.tags = ['Auth']
            #swagger.summary = 'Login a user'
            #swagger.description = 'Logs in a user after validating the email and password.'
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'User login info',
                required: true,
                schema: {
                    email: 'johndoe@example.com',
                    password: 'password123'
                }
            }
            #swagger.responses[400] = {
                description: 'Invalid Credentials',
                schema: {
                    message: 'Invalid Credentials'
                }
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const body = req.body;
      const validator = vine.create(loginSchema);
      const payload = await validator.validate(body);

      // * Check if the email is not in use
      const findUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!findUser) {
        return res.status(400).json({
          errors: "Invalid Credentials",
        });
      }

      // * Compare the password
      const isPasswordValid = bcrypt.compareSync(
        payload.password,
        findUser.password,
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          errors: "Invalid Credentials",
        });
      }

      // * Send the JWT Token to the user
      const token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "Login successful",
        access_token: `Bearer ${token}`,
      });
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // * 400 Bad Request
        return res.status(400).json({ errors: error.messages });
      }
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
}

export default AuthController;
