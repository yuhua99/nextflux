// 默认的弹出动画配置
export const popUpVariants = {
  enter: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.2,
      bounce: 0.2,
      ease: "easeInOut",
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring",
      duration: 0.2,
      bounce: 0.2,
      ease: "easeInOut",
    },
  },
};