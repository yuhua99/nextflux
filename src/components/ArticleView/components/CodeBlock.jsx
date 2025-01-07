import { codeToHtml } from "shiki";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { settingsState } from "@/stores/settingsStore.js";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils.js";

export default function CodeBlock({ code, language }) {
  const [html, setHtml] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { showLineNumbers } = useStore(settingsState);

  useEffect(() => {
    async function highlight() {
      const highlighted = await codeToHtml(code, {
        lang: language || "text",
        themes: {
          light: "catppuccin-latte",
          dark: "github-dark",
        },
      });
      setHtml(highlighted);
    }

    highlight();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("复制失败:", err);
      toast.error("复制失败");
    }
  };

  return (
    <div
      className={cn(
        "code-block relative group",
        showLineNumbers ? "line-numbers" : "",
      )}
    >
      <span className="text-xs absolute right-2 top-1 text-default-500 opacity-100 group-hover:opacity-0 transition-opacity">
        {language}
      </span>
      <Tooltip size="sm" closeDelay="0" content="复制">
        <Button
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
          isDisabled={isCopied}
          variant="light"
          isIconOnly
          onPress={handleCopy}
        >
          {isCopied ? (
            <Check className="size-4 text-default-500" />
          ) : (
            <Copy className="size-4 text-default-500" />
          )}
        </Button>
      </Tooltip>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
