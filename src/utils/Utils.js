export const removePriceLevel = (price, items) => {
  return items.filter(item => item[0] !== price);
};

export const levelExists = (price, currentLevels) => {
  return currentLevels.some(level => level[0] === price);
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
