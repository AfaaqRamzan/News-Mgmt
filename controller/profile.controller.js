// Class for handling profile related operations like in REST APIs
// in index we fetching the data from user table
// in store we inserting the data in user table
// in show we fetching the data from user table by id
// in update we updating the data in user table by id
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
  static async update() {}

  //   * Delete the user profile
  static async destroy() {}
}

export default ProfileController;
