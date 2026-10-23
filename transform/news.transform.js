import { getImageUrl } from "../utils/helper.js";

class NewsApiTransform {
  static transform(news) {
    return {
      id: news.id,
      heading: news.title,
      news: news.content,
      image: getImageUrl(news.image),
      created_at: news.created_at,
      reporter: {
        id: news.author.id,
        name: news?.author?.name,
        profile:
          news?.author?.profile != null
            ? getImageUrl(news?.author?.profile)
            : "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      },
    };
  }
}

export default NewsApiTransform;
