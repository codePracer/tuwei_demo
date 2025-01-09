import React, {
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-web';

import animationData from './assets/loading-animation.json';  // 假设你有Lottie动画资源
import {
  apiRequest,
  calculateProgress,
  fetchRewardData,
  getHistoryFromLocalStorage,
  removeDuplicateCodes,
  saveHistoryToLocalStorage,
  validateActivationCodeFormat,
} from './utils';

function App() {
  const [codes, setCodes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activationHistory, setActivationHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [rewardsPreview, setRewardsPreview] = useState([]);
  const [failedCodes, setFailedCodes] = useState([]);
  const [isRetried, setIsRetried] = useState(false);

  useEffect(() => {
    // 初始化Lottie动画
    if (isProcessing) {
      Lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        animationData: animationData,
        loop: true,
        autoplay: true,
      });
    }
  }, [isProcessing]);

  useEffect(() => {
    // 加载历史记录
    const history = getHistoryFromLocalStorage();
    setActivationHistory(history);
  }, []);

  const handleCodeChange = (event) => {
    setCodes(event.target.value);
  };

  const validateCodes = () => {
    const codeArray = codes.split('\n').map((code) => code.trim());
    const validCodes = codeArray.filter(validateActivationCodeFormat);
    const uniqueCodes = removeDuplicateCodes(validCodes);
    setCodes(uniqueCodes.join('\n'));

    // 更新待兑换内容预览
    const preview = uniqueCodes.map(fetchRewardData);
    setRewardsPreview(preview);
  };

  const redeemCodes = async () => {
    const codeArray = codes.split('\n').map((code) => code.trim());
    const uniqueCodes = removeDuplicateCodes(codeArray);
    setIsProcessing(true);
    setFailedCodes([]);

    // 模拟批量兑换进度
    let current = 0;
    const total = uniqueCodes.length;

    const results = [];
    const failedCodes = [];

    for (let i = 0; i < total; i++) {
      // 模拟API请求
      const result = await apiRequest('/api/redeem', 'POST', { codes: [uniqueCodes[i]] });

      if (result.success) {
        results.push(result);
      } else {
        failedCodes.push(uniqueCodes[i]);
      }

      current++;
      setProgress(calculateProgress(total, current));
    }

    // 汇总结果
    const successCount = results.length;
    const failedCount = failedCodes.length;

    setResult({ successCount, failedCount });
    setFailedCodes(failedCodes);
    setIsProcessing(false);

    // 更新历史记录
    const newHistory = [
      ...activationHistory,
      { date: new Date(), successCount, failedCount, failedCodes },
    ];
    setActivationHistory(newHistory);
    saveHistoryToLocalStorage(newHistory);
  };

  const retryFailedCodes = async () => {
    setIsRetried(true);
    const failedCodesToRetry = failedCodes.slice();
    setFailedCodes([]);
    await redeemCodes(failedCodesToRetry);
  };

  return (
    <div>
      <h1>游戏激活码兑换系统</h1>
      <textarea value={codes} onChange={handleCodeChange} placeholder="请输入激活码，每行一个" rows="5" cols="40"></textarea>
      <button onClick={validateCodes}>验证激活码</button>

      <div>
        <h3>待兑换内容预览</h3>
        <ul>
          {rewardsPreview.map((reward, index) => (
            <li key={index}>
              <div>奖励名称: {reward.name}</div>
              <div>奖励描述: {reward.description}</div>
              <div>奖励数量: {reward.amount}</div>
            </li>
          ))}
        </ul>
      </div>

      {isProcessing ? (
        <div>
          <div id="lottie-animation" style={{ width: 200, height: 200 }}></div>
          <div>兑换进度: {progress}%</div>
        </div>
      ) : (
        <button onClick={redeemCodes}>开始兑换</button>
      )}

      {result && (
        <div>
          <h3>兑换结果</h3>
          <div>成功: {result.successCount}，失败: {result.failedCount}</div>
          {failedCodes.length > 0 && (
            <div>
              <h4>失败的激活码：</h4>
              <ul>
                {failedCodes.map((code, index) => (
                  <li key={index}>{code}</li>
                ))}
              </ul>
              <button onClick={retryFailedCodes}>重试失败的兑换</button>
            </div>
          )}
        </div>
      )}

      <h3>兑换历史</h3>
      <ul>
        {activationHistory.map((item, index) => (
          <li key={index}>
            {item.date} - 成功: {item.successCount}，失败: {item.failedCount}
            {item.failedCodes && (
              <div>
                <strong>失败的激活码:</strong>
                <ul>
                  {item.failedCodes.map((code, idx) => (
                    <li key={idx}>{code}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
