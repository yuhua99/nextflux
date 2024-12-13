import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/stores/authStore";
import { Button, Input } from "@nextui-org/react";
import { BookOpenText } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverUrl, setServerUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(serverUrl, apiKey);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary">
            <BookOpenText className="size-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            登录到 ReactFlux
          </h1>
          <p className="text-sm text-content2-foreground">
            输入你的 Miniflux 服务器地址和 API 密钥
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <span>服务器地址</span>
            <Input
              id="server"
              placeholder="https://example.com"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <span>API 密钥</span>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
      </div>
    </div>
  );
}
