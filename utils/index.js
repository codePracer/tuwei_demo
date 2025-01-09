// utils.js

// 激活码格式验证（每组4位字母和数字）
export function validateActivationCodeFormat(code) {
  const regex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
  return regex.test(code);
}

// 去除重复的激活码
export function removeDuplicateCodes(codes) {
  return [...new Set(codes)];
}

// 计算兑换进度（模拟任务的完成度）
export function calculateProgress(total, current) {
  return Math.floor((current / total) * 100);
}

// 获取缓存的兑换历史记录（本地存储）
export function getHistoryFromLocalStorage() {
  const history = localStorage.getItem('activationHistory');
  return history ? JSON.parse(history) : [];
}

// 保存兑换记录到本地存储
export function saveHistoryToLocalStorage(history) {
  localStorage.setItem('activationHistory', JSON.stringify(history));
}

// 模拟API请求的基础方法
export async function apiRequest(url, method, body = null) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
  const result = await response.json();
  return result;
}

// 获取兑换内容（例如：奖励）
export function fetchRewardData(code) {
  // 模拟根据激活码获取奖励信息的API请求
  return {
    id: code,
    name: "奖励 " + code,
    description: "兑换奖励的描述",
    amount: Math.floor(Math.random() * 10) + 1,
  };
}

// 批量处理兑换，返回每个激活码的兑换结果
export async function processRedemption(codes) {
  const results = [];
  const failedCodes = [];

  for (let i = 0; i < codes.length; i++) {
    const result = await apiRequest('/api/redeem', 'POST', { codes: [codes[i]] });

    if (result.success) {
      results.push(result);
    } else {
      failedCodes.push(codes[i]);
    }
  }

  return { results, failedCodes };
}

// utils.js

export const processRedemptionWithConcurrency = async (codes, maxConcurrency, updateProgressCallback) => {
  let results = [];
  let failedCodes = [];

  const totalCodes = codes.length;
  let processedCount = 0;

  // 通过 Promise.all 创建并发请求
  const processBatch = async (batch) => {
    for (const code of batch) {
      try {
        // 假设这里是调用兑换 API
        const response = await apiRequest(code);  // 替换为实际请求
        if (response.success) {
          results.push(response);
        } else {
          failedCodes.push(code);
        }
      } catch (error) {
        failedCodes.push(code);
      }
      processedCount += 1;

      // 调用进度更新回调
      if (updateProgressCallback) {
        updateProgressCallback(processedCount, totalCodes);
      }
    }
  };

  // 将 codes 按最大并发数进行分批处理
  const batches = [];
  while (codes.length) {
    batches.push(codes.splice(0, maxConcurrency));
  }

  // 处理每一批次
  for (const batch of batches) {
    await processBatch(batch);
  }

  return { results, failedCodes };
};
