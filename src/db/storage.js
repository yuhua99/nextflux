class Storage {
  constructor() {
    this.dbName = "minifluxReader";
    this.dbVersion = 5;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("无法打开数据库"));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const transaction = event.target.transaction;

        // 处理分类存储
        let categoriesStore;
        if (!db.objectStoreNames.contains("categories")) {
          categoriesStore = db.createObjectStore("categories", {
            keyPath: "id",
          });
        } else {
          categoriesStore = transaction.objectStore("categories");
        }
        // 确保索引存在
        if (!categoriesStore.indexNames.contains("title")) {
          categoriesStore.createIndex("title", "title", { unique: true });
        }

        // 处理文章存储
        let articlesStore;
        if (!db.objectStoreNames.contains("articles")) {
          articlesStore = db.createObjectStore("articles", {
            keyPath: "id",
          });
        } else {
          articlesStore = transaction.objectStore("articles");
        }
        // 确保所有需要的索引存在
        if (!articlesStore.indexNames.contains("feedId")) {
          articlesStore.createIndex("feedId", "feedId", { unique: false });
        }
        if (!articlesStore.indexNames.contains("status")) {
          articlesStore.createIndex("status", "status", { unique: false });
        }
        if (!articlesStore.indexNames.contains("starred")) {
          articlesStore.createIndex("starred", "starred", { unique: false });
        }
        if (!articlesStore.indexNames.contains("status_feedId")) {
          articlesStore.createIndex("status_feedId", ["status", "feedId"], {
            unique: false,
          });
        }
        if (!articlesStore.indexNames.contains("starred_feedId")) {
          articlesStore.createIndex("starred_feedId", ["starred", "feedId"], {
            unique: false,
          });
        }

        // 处理订阅源存储
        let feedsStore;
        if (!db.objectStoreNames.contains("feeds")) {
          feedsStore = db.createObjectStore("feeds", {
            keyPath: "id",
            autoIncrement: true,
          });
        } else {
          feedsStore = transaction.objectStore("feeds");
        }
        // 确保所有需要的索引存在
        if (!feedsStore.indexNames.contains("url")) {
          feedsStore.createIndex("url", "url", { unique: true });
        }
        if (!feedsStore.indexNames.contains("categoryName")) {
          feedsStore.createIndex("categoryName", "categoryName", {
            unique: false,
          });
        }
      };
    });
  }

  // 添加文章
  async addArticles(articles) {
    const tx = this.db.transaction("articles", "readwrite");
    const store = tx.objectStore("articles");

    for (const article of articles) {
      await store.put(article);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // 获取文章列表
  async getArticles(feedId = null, status = null) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");

    return new Promise((resolve, reject) => {
      let request;

      if (feedId) {
        const index = store.index("feedId");
        request = index.getAll(feedId);
      } else if (status) {
        const index = store.index("status");
        request = index.getAll(status);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 添加订阅源
  async addFeed(feed) {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.put(feed);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取所有订阅源
  async getFeeds() {
    const tx = this.db.transaction("feeds", "readonly");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 存储上次同步时间
  setLastSyncTime(time) {
    localStorage.setItem("lastSyncTime", time.toISOString());
  }

  // 获取上次同步时间
  getLastSyncTime() {
    const time = localStorage.getItem("lastSyncTime");
    return time ? new Date(time) : null;
  }

  // 获取订阅源未读文章数量
  async getUnreadCount(feedId) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");
    const index = store.index("status_feedId");

    return new Promise((resolve, reject) => {
      const request = index.count(["unread", feedId]);
      request.onsuccess = () => {
        const unreadCount = request.result;
        resolve(unreadCount);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除数据库中的订阅源
  async deleteFeed(feedId) {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.delete(feedId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 删除全部订阅源
  async deleteAllFeeds() {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");
    await store.clear();
  }

  // 删除数据库中指定订阅源的所有文章
  async deleteArticlesByFeedId(feedId) {
    const tx = this.db.transaction("articles", "readwrite");
    const store = tx.objectStore("articles");
    const index = store.index("feedId");

    return new Promise((resolve, reject) => {
      const request = index.getAllKeys(feedId);

      request.onsuccess = async () => {
        const articleIds = request.result;
        for (const articleId of articleIds) {
          await store.delete(articleId);
        }
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  // 获取订阅源收藏文章数量
  async getStarredCount(feedId) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");
    const index = store.index("starred_feedId");

    return new Promise((resolve, reject) => {
      const request = index.count([1, feedId]);
      request.onsuccess = () => {
        const starredCount = request.result;
        resolve(starredCount);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 添加分类
  async addCategory(category) {
    const tx = this.db.transaction("categories", "readwrite");
    const store = tx.objectStore("categories");

    return new Promise((resolve, reject) => {
      const request = store.put(category);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取所有分类
  async getCategories() {
    const tx = this.db.transaction("categories", "readonly");
    const store = tx.objectStore("categories");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 删除全部分类
  async deleteAllCategories() {
    const tx = this.db.transaction("categories", "readwrite");
    const store = tx.objectStore("categories");
    await store.clear();
  }

  // 获取文章总数
  async getArticlesCount(feedIds, filter = "all") {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");

    return new Promise((resolve, reject) => {
      let totalCount = 0;
      let completedQueries = 0;

      // 为每个 feedId 执行查询
      feedIds.forEach((feedId) => {
        let request;
        const statusIndex = store.index("status_feedId");
        const starredIndex = store.index("starred_feedId");
        const feedIndex = store.index("feedId");

        switch (filter) {
          case "unread":
            request = statusIndex.count(["unread", feedId]);
            break;
          case "starred":
            request = starredIndex.count([1, feedId]);
            break;
          default:
            request = feedIndex.count(feedId);
        }

        request.onsuccess = () => {
          totalCount += request.result;
          completedQueries++;

          // 当所有查询完成时返回总数
          if (completedQueries === feedIds.length) {
            resolve(totalCount);
          }
        };

        request.onerror = () => reject(request.error);
      });
    });
  }

  // 分页获取文章
  async getArticlesByPage(
    feedIds,
    filter = "all",
    page = 1,
    pageSize = 30,
    sortDirection = "desc",
  ) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");
    const index = store.index("feedId");

    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        let articles = request.result.filter((article) =>
          feedIds.includes(article.feedId),
        );

        // 根据筛选条件过滤
        switch (filter) {
          case "unread":
            articles = articles.filter((article) => article.status !== "read");
            break;
          case "starred":
            articles = articles.filter((article) => article.starred);
            break;
        }

        // 排序
        articles.sort((a, b) => {
          const direction = sortDirection === "desc" ? 1 : -1;
          return direction * (new Date(b.created_at) - new Date(a.created_at));
        });

        // 分页
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        resolve(articles.slice(start, end));
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 根据id获取文章
  async getArticleById(id) {
    await this.init();
    const tx = this.db.transaction(["articles", "feeds"], "readonly");
    const articlesStore = tx.objectStore("articles");
    const feedsStore = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const articleRequest = articlesStore.get(parseInt(id));
      
      articleRequest.onsuccess = () => {
        const article = articleRequest.result;
        if (!article) {
          resolve(null);
          return;
        }

        const feedRequest = feedsStore.get(article.feedId);
        feedRequest.onsuccess = () => {
          const feed = feedRequest.result;
          resolve({
            ...article,
            feed: {
              ...feed,
            },
          });
        };
        feedRequest.onerror = () => reject(feedRequest.error);
      };
      
      articleRequest.onerror = () => reject(articleRequest.error);
    });
  }
}

export default new Storage();
