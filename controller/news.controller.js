import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/news.validation.js";
import { imageValidator, removeImage, uploadImage } from "../utils/helper.js";
import { prisma } from "../DB/db.config.js";
import NewsTransform from "../transform/news.transform.js";

class NewsController {
  static async index(req, res) {
    /*  #swagger.tags = ['News']
            #swagger.summary = 'Index/Get all news'
            #swagger.description = 'Returns the news information of all the news.'
            #swagger.responses[200] = {
                description: 'News fetched successfully',
            }
            #swagger.responses[408] = {
                description: 'Request Timeout'
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
    */

    // OffSet Pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (page <= 0 || !page) {
      page = 1;
    }
    if (limit <= 0 || limit > 100 || !limit) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });
    const newsTransform = news?.map((item) => NewsTransform.transform(item));

    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);

    return res.status(200).json({
      news: newsTransform,
      metadata: {
        totalPages,
        currentPage: page > totalPages ? totalPages : page,
        currentLimit: limit,
        totalRecords: totalNews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  }

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

  static async show(req, res) {
    /*  #swagger.tags = ['News']
            #swagger.summary = 'Show news by ID'
            #swagger.description = 'Returns the news information of the specified news by ID.'
            #swagger.parameters['id'] = {
                in: 'path',
                type: 'string',
                required: true,
                description: 'News ID'
            }
            #swagger.responses[200] = {
                description: 'News fetched successfully',
            }
            #swagger.responses[404] = {
                description: 'News not found'
            }
            #swagger.responses[408] = {
                description: 'Request Timeout'
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
      if (!news) {
        return res.status(404).json({ message: "News not found!" });
      }
      const transFormNews = NewsTransform.transform(news);
      return res.status(200).json({ news: transFormNews });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ message: "Somrthing went wrong.please try again." });
      }
    }
  }

  static async update(req, res) {
    /*  #swagger.tags = ['News']
            #swagger.summary = 'Update news by ID'
            #swagger.description = 'Update the news information.'
            #swagger.consumes = ['multipart/form-data']
            #swagger.security = [{ "bearerAuth": [] }]

            #swagger.parameters['id'] = {
                in: 'path',
                type: 'string',
                required: true,
                description: 'Update news ID'
            }
            #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                required: true,
                description: 'Update news title'
            }

            #swagger.parameters['content'] = {
                in: 'formData',
                type: 'string',
                required: true,
                description: 'Update news content'
            }

            #swagger.parameters['image'] = {
                in: 'formData',
                type: 'file',
                description: 'Update news image'
            }

            #swagger.responses[200] = {
                description: 'News updated successfully',
                schema: {
                    status: 200,
                    message:"News updated successfully!",
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
            #swagger.responses[404] = {
                description: 'News not found'
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;
      const news = await prisma.news.findUnique({
        where: {
          id,
        },
      });
      if (!news) {
        return res.status(404).json({ message: "News not found!" });
      }
      // * Check if the user is the author of the news
      if (user.id !== news.author_id) {
        return res.status(401).json({ message: "UnAuthorized" });
      }
      const validator = vine.create(newsSchema);
      const payload = await validator.validate(body);
      const image = req?.files?.image;

      if (image) {
        const message = imageValidator(image?.size, image?.mimetype);
        if (message !== null) {
          return res.status(422).json({
            errors: {
              image: message,
            },
          });
        }

        //   * Upload new image
        const imageName = await uploadImage(image);
        payload.image = imageName;
        // * Delete old image
        removeImage(news.image);
      }

      await prisma.news.update({
        data: payload,
        where: {
          id,
        },
      });

      return res.status(200).json({ message: "News updated successfully!" });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong.please try again." });
      }
    }
  }

  static async destroy(req, res) {
    /*  #swagger.tags = ['News']
            #swagger.summary = 'Delete news by ID'
            #swagger.description = 'Delete the news by ID.'
            #swagger.consumes = ['multipart/form-data']
            #swagger.security = [{ "bearerAuth": [] }]

            #swagger.parameters['id'] = {
                in: 'path',
                type: 'string',
                required: true,
                description: 'Delete news ID'
            }
            #swagger.responses[200] = {
                description: 'News deleted successfully',
            }
            #swagger.responses[401] = {
                description: 'Unauthorized'
            }
            #swagger.responses[404] = {
                description: 'News not found'
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
        */
    try {
      const { id } = req.params;
      const user = req.user;
      const news = await prisma.news.findUnique({
        where: {
          id,
        },
      });
      if (!news) {
        return res.status(404).json({ message: "News not found!" });
      }
      // * Check if the user is the author of the news
      if (user.id !== news.author_id) {
        return res.status(401).json({ message: "UnAuthorized" });
      }

      // * Delete image from filesystem
      removeImage(news.image);
      await prisma.news.delete({
        where: {
          id,
        },
      });
      return res.json({ message: "News deleted successfully!" });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Something went wrong.Please try again.",
      });
    }
  }
}

export default NewsController;
