import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, authState } from "@/stores/authStore";
import { Button, Form, Input, Link } from "@nextui-org/react";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@nanostores/react";

export default function LoginPage() {
  const navigate = useNavigate();
  const $auth = useStore(authState);
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ($auth.serverUrl && $auth.username && $auth.password) {
      navigate("/");
    }
  }, [$auth.serverUrl, $auth.username, $auth.password, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(serverUrl, username, password);
      navigate("/");
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-content2 p-4">
      <div className="w-full max-w-sm space-y-6 p-6 bg-content1 rounded-lg shadow-custom">
        <h1 className="text-2xl font-semibold tracking-tight">
          登录到您的服务器
        </h1>

        <Form
          className="flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            labelPlacement="outside"
            label="服务器地址"
            name="serverUrl"
            placeholder="请输入 Miniflux 服务器地址"
            type="text"
            variant="faded"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
          <Input
            isRequired
            labelPlacement="outside"
            label="用户名"
            name="username"
            placeholder="请输入用户名"
            type="text"
            variant="faded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            isRequired
            labelPlacement="outside"
            endContent={
              <button type="button" onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? (
                  <EyeClosed className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                ) : (
                  <Eye className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                )}
              </button>
            }
            label="密码"
            name="password"
            placeholder="请输入密码"
            type={isVisible ? "text" : "password"}
            variant="faded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <span className="text-sm text-default-500">需要更多信息？</span>
            <Link href="https://miniflux.app" size="sm">
              前往 Miniflux 官网
            </Link>
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            登 录
          </Button>
        </Form>
      </div>
    </div>
  );
}
