import { FC, ReactNode } from "react";

interface BannerProps {
  children: ReactNode;
  type: "error" | "success" | "warning" | "info";
  onClose?: () => void;
}

const Banner: FC<BannerProps> = ({ children, type, onClose }) => {
  const getBgColor = () => {
    switch (type) {
      case "error":
        return "bg-red-500/10";
      case "success":
        return "bg-green-500/10";
      case "warning":
        return "bg-yellow-500/10";
      case "info":
        return "bg-blue-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg ${getBgColor()} ${getTextColor()} mt-3`}
    >
      <div className="flex w-full justify-between items-start space-x-3">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            className="opacity-70 hover:opacity-100 transition-opacity duration-150"
            onClick={onClose}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.707 10.293a1 1 0 11-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 11-1.414-1.414L6.586 8 4.293 5.707a1 1 0 011.414-1.414L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
