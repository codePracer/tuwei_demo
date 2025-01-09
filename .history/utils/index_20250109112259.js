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

// 执行API请求的基础方法
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
