import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import Lottie from 'lottie-web';

function App() {
  const [codes, setCodes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [redeemResult, setRedeemResult] = useState(null);
  const [history, setHistory] = useState(() => {
    // 从localStorage中读取兑换记录
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const handleCodeInput = (e) => {
    const newCodes = e.target.value.split('\n').map(line => line.trim()).filter(code => code);
    setCodes(newCodes);
  };

  const verifyCodes = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verifyCodes', {
        codes,
        deviceId: 'device_001',
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying codes:', error);
    }
  };

  const redeemCodes = async () => {
    setIsProcessing(true);
    setProgress(0);
    try {
      const response = await axios.post('http://localhost:5000/redeemCodes', {
        codes,
        deviceId: 'device_001'
      });

      const { data } = response;
      setRedeemResult(data);

      // 批量处理进度模拟
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 200);

      // 保存兑换记录到本地存储
      const newHistory = [...history, data];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));

    } catch (error) {
      console.error('Error redeeming codes:', error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const animation = Lottie.loadAnimation({
      container: document.querySelector('#lottie-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/public/path/to/your/animation.json'
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className="App">
      <h1>游戏激活码兑换系统</h1>

      <textarea
        placeholder="输入激活码，每个激活码一行"
        rows={5}
        onChange={handleCodeInput}
      ></textarea>

      <button onClick={verifyCodes}>验证激活码</button>

      {isProcessing ? (
        <div>
          <div id="lottie-animation" style={{ width: 200, height: 200 }}></div>
          <div>兑换进度: {progress}%</div>
        </div>
      ) : (
        <button onClick={redeemCodes}>开始兑换</button>
      )}

      {redeemResult && (
        <div>
          <h3>兑换结果</h3>
          <div>
            总数: {redeemResult.data.summary.total}, 成功: {redeemResult.data.summary.success}, 失败: {redeemResult.data.summary.failed}
          </div>
        </div>
      )}

      <h3>兑换历史</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item.date} - {item.summary.success} 成功，{item.summary.failed} 失败
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
