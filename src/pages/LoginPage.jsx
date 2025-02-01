import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authState, login } from "@/stores/authStore";
import { Button, Form, Input, Link } from "@heroui/react";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@nanostores/react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const navigate = useNavigate();
  const $auth = useStore(authState);
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
          {t("auth.login")}
        </h1>

        <Form
          className="flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            labelPlacement="outside"
            label={t("auth.serverUrl")}
            name="serverUrl"
            placeholder={t("auth.serverUrlPlaceholder")}
            type="text"
            variant="faded"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
          <Input
            isRequired
            labelPlacement="outside"
            label={t("auth.username")}
            name="username"
            placeholder={t("auth.usernamePlaceholder")}
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
            label={t("auth.password")}
            name="password"
            placeholder={t("auth.passwordPlaceholder")}
            type={isVisible ? "text" : "password"}
            variant="faded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <span className="text-sm text-default-500">
              {t("auth.needMoreInfo")}
            </span>
            <Link href="https://miniflux.app" size="sm">
              {t("auth.visitMiniflux")}
            </Link>
          </div>
          <Button
            className="w-full bg-primary bg-gradient-to-b from-white/15 to-transparent border-primary border shadow-custom-button"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            {t("common.login")}
          </Button>
        </Form>
      </div>
    </div>
  );
}
