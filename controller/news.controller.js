import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/news.validation.js";
import { imageValidator, uploadImage } from "../utils/helper.js";
import { prisma } from "../DB/db.config.js";

class NewsController {
  static async index(req, res) {}

  static async store(req, res) {
    /*  #swagger.tags = ['News']
            #swagger.summary = 'Store/Create news'
            #swagger.description = 'Returns the news information of the currently authenticated user.'
            #swagger.consumes = ['multipart/form-data']
            #swagger.security = [{ "bearerAuth": [] }]


            #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                required: true,
                description: 'News title'
            }

            #swagger.parameters['content'] = {
                in: 'formData',
                type: 'string',
                required: true,
                description: 'News content'
            }

            #swagger.parameters['image'] = {
                in: 'formData',
                type: 'file',
                required: true,
                description: 'News image'
            }

            #swagger.responses[201] = {
                description: 'News created successfully',
                schema: {
                    status: 201,
                    message:"News created successfully!",
                    news:{
                      title: 'News Title',
                      content: 'News content',
                      image: 'image.jpg',
                    }
                }
            }
            #swagger.responses[401] = {
                description: 'Unauthorized'
            }
            #swagger.responses[422] = {
                description: 'Validation error | Invalid image format. Only PNG, JPG, and JPEG are allowed | Image size must be less than 2 MB'
            }
            #swagger.responses[409] = {
                description: 'Title already exists'
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.create(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          errors: {
            image: "Image field is required.",
          },
        });
      }
      const image = Array.isArray(req.files.image)
        ? req.files.image[0]
        : req.files.image;
      //   * Image custom validator
      const message = imageValidator(image?.size, image?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      //   * Image upload
      const imageName = await uploadImage(image);
      payload.image = imageName;
      payload.author_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      return res.status(201).json({
        message: "News created successfully!",
        news,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong.Please try again.",
        });
      }
    }
  }

  static async show(req, res) {}

  static async update(req, res) {}

  static async destroy(req, res) {}
}

export default NewsController;
