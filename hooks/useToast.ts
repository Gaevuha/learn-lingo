"use client";
interface IziToastOptions {
  title: string;
  message: string;
  position:
    | "topRight"
    | "topLeft"
    | "bottomRight"
    | "bottomLeft"
    | "topCenter"
    | "bottomCenter"
    | "center";
  timeout: number;
  displayMode: 0 | 1 | 2;
  transitionIn?: string;
  transitionOut?: string;
  backgroundColor?: string;
  titleColor?: string;
  messageColor?: string;
  icon?: string;
}

interface IziToastInstance {
  success(options: IziToastOptions): void;
  error(options: IziToastOptions): void;
  info(options: IziToastOptions): void;
  warning(options: IziToastOptions): void;
  destroy(): void;
}

export const useToast = () => {
  const getIziToast = (): IziToastInstance | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const globalIziToast = (window as { iziToast?: IziToastInstance }).iziToast;
    return globalIziToast || null;
  };

  const showSuccess = (message: string, title: string = "Успішно!") => {
    const iziToast = getIziToast();
    if (iziToast) {
      iziToast.success({
        title,
        message,
        position: "topRight",
        timeout: 3000,
        displayMode: 2,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        backgroundColor: "#d4edda",
        titleColor: "#155724",
        messageColor: "#155724",
        icon: "ico-success",
      });
    }
  };

  const showError = (message: string, title: string = "Помилка!") => {
    const iziToast = getIziToast();
    if (iziToast) {
      iziToast.error({
        title,
        message,
        position: "topRight",
        timeout: 4000,
        displayMode: 2,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        backgroundColor: "#f8d7da",
        titleColor: "#721c24",
        messageColor: "#721c24",
        icon: "ico-error",
      });
    }
  };

  const showInfo = (message: string, title: string = "Інформація") => {
    const iziToast = getIziToast();
    if (iziToast) {
      iziToast.info({
        title,
        message,
        position: "topRight",
        timeout: 3000,
        displayMode: 2,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        backgroundColor: "#d1ecf1",
        titleColor: "#0c5460",
        messageColor: "#0c5460",
        icon: "ico-info",
      });
    }
  };

  const showWarning = (message: string, title: string = "Увага!") => {
    const iziToast = getIziToast();
    if (iziToast) {
      iziToast.warning({
        title,
        message,
        position: "topRight",
        timeout: 4000,
        displayMode: 2,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        backgroundColor: "#fff3cd",
        titleColor: "#856404",
        messageColor: "#856404",
        icon: "ico-warning",
      });
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    switch (type) {
      case "success":
        showSuccess(message);
        break;
      case "error":
        showError(message);
        break;
      case "info":
        showInfo(message);
        break;
      case "warning":
        showWarning(message);
        break;
      default:
        showInfo(message);
    }
  };

  const clearAll = () => {
    const iziToast = getIziToast();
    if (iziToast) {
      iziToast.destroy();
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showToast,
    clearAll,
  };
};
