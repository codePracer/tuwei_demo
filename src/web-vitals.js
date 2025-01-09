// web-vitals.js
import {
  getCLS,
  getFCP,
  getFID,
  getINP,
  getLCP,
  getTTFB,
} from 'web-vitals';

export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
    getFCP(onPerfEntry);
    getINP(onPerfEntry);
  }
}
