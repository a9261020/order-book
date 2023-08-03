export const removePriceLevel = (price, levels) => {
  return levels.filter(level => level[0] !== price);
};

export const levelExists = (price, levels) => {
  return levels.some(level => level[0] === price);
};

export const updatePriceLevel = (bid, levels) => {
  return levels.map(level => {
    if (level[0] === bid[0]) {
      let trend = '';
      if (level[1] < bid[1]) {
        trend = 'increase';
      } else if (level[1] > bid[1]) {
        trend = 'decrease';
      }
      level = bid;
      level[2] = trend;
    }
    return level;
  });
};

export const addPriceLevel = (deltaLevel, levels) => {
  const newDeltaLevel = [...deltaLevel, 'new'];
  return [...levels, newDeltaLevel];
};

export const formatNumber = (value, minimumFractionDigits = 0) => {
  return (+value).toLocaleString('en-US', {
    minimumFractionDigits,
  });
};
