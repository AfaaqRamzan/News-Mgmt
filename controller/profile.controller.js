// Class for handling profile related operations like in REST APIs
// in index we fetching the data from user table
// in store we inserting the data in user table
// in show we fetching the data from user table by id
// in update we updating the data in user table by id

import { prisma } from "../DB/db.config";
import { generateRandomNum, imageValidator } from "../utils/helper";
import fs from "fs";
import path from "path";

// in destroy we deleting the data from user table by id
class ProfileController {
  // * Get the data
  static async index(req, res) {
    /*  #swagger.tags = ['Profile']
            #swagger.summary = 'Get logged in user profile'
            #swagger.description = 'Returns the profile information of the currently authenticated user.'
            #swagger.security = [{ "bearerAuth": [] }]
            #swagger.responses[200] = {
                description: 'User profile fetched successfully',
                schema: {
                    status: 200,
                    user: {
                        id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
                        name: 'John Doe',
                        email: 'johndoe@example.com',
                        profile: 'user.jpg',
                        createdAt: '2026-07-16T12:00:00.000Z',
                        updatedAt: '2026-07-16T12:00:00.000Z'
                    }
                }
            }
            #swagger.responses[401] = {
                description: 'Unauthorized',
                schema: {
                    message: 'Unauthorized. Please login.'
                }
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const user = req.user;
      return res.json({ status: 200, user });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }

  //   * Create the user profile
  static async store() {
    /*  #swagger.tags = ['Profile']
            #swagger.summary = 'Create user profile'
            #swagger.description = 'Creates a new user profile.'
            #swagger.security = [{ "bearerAuth": [] }]
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'User profile info',
                required: true,
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
      const user = req.user;
      return res.json({ status: 200, user });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }

  //   * Create the user profile
  static async store() {}

  //   * Get the user profile by id
  static async show() {}

  //   * Update the user profile
  static async update(req, res) {
    /*  #swagger.tags = ['Profile']
          #swagger.summary = 'Update user profile'
          #swagger.description = 'Updates the user profile.'
          #swagger.consumes = ['multipart/form-data']
          #swagger.security = [{ "bearerAuth": [] }]

          #swagger.parameters['id'] = {
            in: 'path',
            description: 'User profile ID',
            required: true,
            type: 'string'
          }

          #swagger.parameters['profile'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Profile image file (PNG, JPG, etc.)'
          }

          #swagger.responses[200] = {
              description: 'Profile updated successfully',
              schema: {
                status: 200,
                message: 'Profile updated successfully!'
              }
          }
          #swagger.responses[400] = {
            description: 'Invalid profile image',
            schema: {
                status: 400,
                message: 'Profile image is required.'
            }
          }
          #swagger.responses[500] = {
            description: 'Internal server error',
            schema: {
              status: 500,
              message: 'Something went wrong.please try again!'
            }
          }
        */

    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Profile ID is required." });
      }
      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Profile image is required." });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }

      const imgExt = profile?.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      // * Get the directory path (e.g. 'D:/Projects/news-mgmt/public/images')
      const dir = path.dirname(uploadPath);

      // * Create the folder if it does not exist (recursive: true creates parent folders too)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // * Move the file
      profile.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          profile: imageName,
        },
      });

      return res.json({
        status: 200,
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.log("The error is", error);
      return res.status(500).json({
        message: "Something went wrong.please try again!",
      });
    }
  }

  //   * Delete the user profile
  static async destroy() {}
}

export default ProfileController;
