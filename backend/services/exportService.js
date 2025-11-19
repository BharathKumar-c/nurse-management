export const generateCSV = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const csv = data.map(row => 
        Object.values(row).join(',')
      ).join('\n');
      resolve(csv);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateXLSX = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

