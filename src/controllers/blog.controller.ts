import { Response, Request } from 'express';
import { Types } from 'mongoose';
import { IBlog } from '../interfaces/blog.interface';
import { IReqAuth } from '../interfaces/user.interface';
import Blogs from '../models/blog.model';

const pagination = (req: IReqAuth) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 4;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
export const createBlog = async (req: IReqAuth, res: Response): Promise<Response> => {
  try {
    const { title, content, description, thumbnail, category }: IBlog = req.body;
    const newBlog = new Blogs({
      user: req.user?.id,
      title: title.toLocaleLowerCase(),
      content,
      description,
      thumbnail,
      category,
    });

    await newBlog.save();
    return res.json({ newBlog, message: 'Se creo correctamente el blog' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBlogs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const blogs = await Blogs.aggregate([
      // User
      {
        $lookup: {
          from: 'users',
          let: { user_id: '$user' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
            { $project: { password: 0 } },
          ],
          as: 'user',
        },
      },
      // array -> object
      { $unwind: '$user' },
      // Category
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      // array -> object
      { $unwind: '$category' },
      // Sorting
      { $sort: { createdAt: -1 } },
      // Group by category
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          blogs: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      // Pagination for blogs
      {
        $project: {
          blogs: { $slice: ['$blogs', 0, 4] },
          count: 1,
          name: 1,
        },
      },
    ]);
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBlogsByCategory = async (req: Request, res: Response): Promise<Response> => {
  const { limit, skip } = pagination(req);
  try {
    const data = await Blogs.aggregate([
      {
        $facet: {
          totalData: [
            { $match: { category: Types.ObjectId(req.params.id) } },
            // User
            {
              $lookup: {
                from: 'users',
                let: { user_id: '$user' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                  { $project: { password: 0 } },
                ],
                as: 'user',
              },
            },
            // array -> object
            { $unwind: '$user' },
            // Sorting
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [
            { $match: { category: Types.ObjectId(req.params.id) } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          count: { $arrayElemAt: ['$totalCount.count', 0] },
          totalData: 1,
        },
      },
    ]);
    const blogs = data[0].totalData;
    const { count } = data[0];

    // Pagination
    let total = 0;

    if (count % limit === 0) {
      total = count / limit;
    } else {
      total = Math.floor(count / limit) + 1;
    }

    return res.json({ blogs, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
