import { toast } from "react-toastify";

import { useEffect, useState } from "react";

export const setToast = (type: "success" | "error", message: string) => {
  sessionStorage.setItem("toast", "true");
  sessionStorage.setItem("message", JSON.stringify({ content: message, type }));
};

export const ShowToast = () => {
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const hasToast = sessionStorage.getItem("toast") === "true" ?? false;
    if (hasToast && !toastShown) {
      const message = JSON.parse(sessionStorage.getItem("message")!);
      if (message.type == "success") {
        toast.success(message.content!, {
          onClose: () => setToastShown(false),
        });
      } else {
        toast.error(message.content, {
          onClose: () => setToastShown(false),
        });
      }
      setToastShown(true);
    }
  }, []);

  useEffect(() => {
    if (toastShown) {
      sessionStorage.removeItem("toast");
      sessionStorage.removeItem("message");
    }
  }, [toastShown]);

  return <span></span>;
};
