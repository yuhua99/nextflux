import axios from "axios";
import { authState, logout } from "@/stores/authStore";
import { toast } from "sonner";

class miniFluxAPI {
  constructor() {
    const auth = authState.get();

    this.client = axios.create({
      baseURL: auth?.serverUrl || "",
      headers:
        auth?.username && auth?.password
          ? {
              Authorization:
                "Basic " + btoa(`${auth.username}:${auth.password}`),
            }
          : {},
    });

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // 如果响应状态码是 401,执行登出操作
        if (error.response?.status === 401) {
          logout();
        }
        const errorMessage = error.response?.data?.error_message;
        if (errorMessage) {
          toast.error(errorMessage);
        }
        return Promise.reject(error);
      },
    );

    // 监听认证状态变化
    authState.listen((newAuth) => {
      this.client.defaults.baseURL = newAuth?.serverUrl || "";
      this.client.defaults.headers["Authorization"] =
        newAuth?.username && newAuth?.password
          ? "Basic " + btoa(`${newAuth.username}:${newAuth.password}`)
          : "";
    });
  }

  // 获取所有订阅源
  async getFeeds() {
    try {
      const response = await this.client.get("/v1/feeds");
      return response.data;
    } catch (error) {
      console.error("获取订阅源失败:", error);
      throw error;
    }
  }

  // 获取指定订阅源的文章
  async getFeedEntries(feedId, params = {}) {
    try {
      const response = await this.client.get(
        "/v1/feeds/" + feedId + "/entries",
        {
          params: { direction: "desc", limit: 50, ...params },
        },
      );
      return response.data.entries;
    } catch (error) {
      console.error("获取文章失败:", error);
      throw error;
    }
  }

  // 更新文章阅读状态
  async updateEntryStatus(entry) {
    try {
      const status = entry.status === "read" ? "unread" : "read";
      await this.client.put("/v1/entries", {
        entry_ids: [entry.id],
        status,
      });
    } catch (error) {
      console.error(
        `标记文章${entry.status === "read" ? "已读" : "未读"}失败:`,
        error,
      );
      throw error;
    }
  }

  // 更新文章星标状态
  async updateEntryStarred(entry) {
    try {
      await this.client.put(`/v1/entries/${entry.id}/bookmark`);
    } catch (error) {
      console.error("更新文章星标状态失败:", error);
      throw error;
    }
  }

  // 获取变更文章
  async getChangedEntries(lastSyncTime) {
    try {
      const timestamp = Math.floor(new Date(lastSyncTime).getTime() / 1000);
      const response = await this.client.get("/v1/entries", {
        params: {
          changed_after: timestamp,
          direction: "desc",
          limit: 0,
        },
      });
      return response.data.entries;
    } catch (error) {
      console.error("获取变更文章失败:", error);
      throw error;
    }
  }

  // 获取新文章
  async getNewEntries(lastSyncTime) {
    try {
      const timestamp = Math.floor(new Date(lastSyncTime).getTime() / 1000);
      const response = await this.client.get("/v1/entries", {
        params: {
          after: timestamp,
          direction: "desc",
          limit: 0,
        },
      });
      return response.data.entries;
    } catch (error) {
      console.error("获取新文章失败:", error);
      throw error;
    }
  }

  // 标记全部已读
  async markAllAsRead(type, id = null) {
    try {
      let endpoint = "/v1/entries";

      // 如果是用户级别的标记已读，先获取用户信息
      if (type === "all") {
        const response = await this.client.get("/v1/me");
        const userId = response.data.id;
        endpoint = `/v1/users/${userId}/mark-all-as-read`;
      } else if (type === "feed" && id) {
        endpoint = `/v1/feeds/${id}/mark-all-as-read`;
      } else if (type === "category" && id) {
        endpoint = `/v1/categories/${id}/mark-all-as-read`;
      }

      await this.client.put(endpoint);
    } catch (error) {
      console.error("标记全部已读失败:", error);
      throw error;
    }
  }

  async getAllStarredEntries() {
    try {
      const response = await this.client.get("/v1/entries", {
        params: {
          starred: true,
          direction: "desc",
          limit: 0, // 不限制数量
        },
      });
      return response.data.entries;
    } catch (error) {
      console.error("获取星标文章失败:", error);
      throw error;
    }
  }

  // 获取文章原始内容
  async fetchEntryContent(entryId) {
    try {
      const response = await this.client.get(
        `/v1/entries/${entryId}/fetch-content`,
      );
      return response.data.content;
    } catch (error) {
      console.error("获取文章原始内容失败:", error);
      throw error;
    }
  }

  async deleteFeed(feedId) {
    try {
      await this.client.delete(`/v1/feeds/${feedId}`);
    } catch (error) {
      console.error("删除订阅源失败:", error);
      throw error;
    }
  }

  // 更新订阅源
  async updateFeed(feedId, data) {
    try {
      const response = await this.client.put(`/v1/feeds/${feedId}`, data);
      return response.data;
    } catch (error) {
      console.error("更新订阅源失败:", error);
      throw error;
    }
  }

  // 创建订阅源
  async createFeed(feedUrl, categoryId, params) {
    try {
      const response = await this.client.post("/v1/feeds", {
        feed_url: feedUrl,
        category_id: categoryId,
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error("创建订阅源失败:", error);
      throw error;
    }
  }

  // 创建分类
  async createCategory(title) {
    try {
      const response = await this.client.post("/v1/categories", {
        title,
      });
      return response.data;
    } catch (error) {
      console.error("创建分类失败:", error);
      throw error;
    }
  }

  // 删除分类
  async deleteCategory(categoryId) {
    try {
      await this.client.delete(`/v1/categories/${categoryId}`);
    } catch (error) {
      console.error("删除分类失败:", error);
      throw error;
    }
  }

  // 更新分类
  async updateCategory(categoryId, title) {
    try {
      const response = await this.client.put(`/v1/categories/${categoryId}`, {
        title,
      });
      return response.data;
    } catch (error) {
      console.error("更新分类失败:", error);
      throw error;
    }
  }

  // 获取所有分类
  async getCategories() {
    try {
      const response = await this.client.get("/v1/categories");
      return response.data;
    } catch (error) {
      console.error("获取分类列表失败:", error);
      throw error;
    }
  }
}

export default new miniFluxAPI();
