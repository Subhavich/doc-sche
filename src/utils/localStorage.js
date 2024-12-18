export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return null;
  }
};

export const clearLocalStorage = (keys) => {
  try {
    keys.forEach((key) => localStorage.removeItem(key));
    console.log("LocalStorage cleared for keys:", keys);
  } catch (error) {
    console.error("Error clearing localStorage", error);
  }
};

export const logAllFromLocalStorage = () => {
  const allLocalStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allLocalStorageData[key] = localStorage.getItem(key);
  }
  console.log(allLocalStorageData);
};
