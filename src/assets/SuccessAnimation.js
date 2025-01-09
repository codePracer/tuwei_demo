// SuccessAnimation.js
import React, { useEffect } from 'react';

import Lottie from 'lottie-web';

import successAnimationData from './success-animation.json';  // 导入成功动画文件

const SuccessAnimation = () => {
  useEffect(() => {
    // 加载并播放动画
    Lottie.loadAnimation({
      container: document.getElementById('success-animation-container'),  // 动画显示的容器
      animationData: successAnimationData,  // 动画数据
      loop: false,  // 不循环播放
      autoplay: true,  // 自动播放
    });

    // 清理动画实例
    return () => Lottie.destroy();
  }, []);

  return (
    <div id="success-animation-container" style={{ width: 200, height: 200, margin: '0 auto' }}></div>
  );
};

export default SuccessAnimation;
