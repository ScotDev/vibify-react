// const setCookie = (name, value, domain) => {
//   const oneDay = 24 * 60 * 60 * 1000;
//   document.cookie = `vibify_${name}=${value} domain=${domain} secure=true httpOnly=true maxAge=${
//     oneDay * 365
//   };`;
// };

// const getCookie = (name) => {};

const setItem = (name, value, expires_in) => {
  //   const oneYear = 24 * 60 * 60 * 1000 * 365;
  const oneHour = 24 * 60 * 60 * 1000;

  const expires = expires_in ? Date.now() + expires_in : Date.now() + oneHour;

  if (window.localStorage) {
    window.localStorage.setItem(
      "vibify_" + name,
      JSON.stringify({ value: value, expires: expires })
    );
  }
};

const getItem = (name) => {
  try {
    const item = JSON.parse(localStorage.getItem("vibify_" + name));
    if (item.expires < Date.now()) {
      console.log("Item expired, removed from local storage");
      localStorage.removeItem("vibify_" + name);
      return null;
    }
    return JSON.parse(localStorage.getItem("vibify_" + name));
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeAllItems = () => {
  if (window.localStorage) {
    // Better if it loops through all the keys and removes only vibify_ keys.
    // If I add more items to localstorage I'll build this out.
    localStorage.removeItem("vibify_spotify_access_token");
    localStorage.removeItem("vibify_spotify_refresh_token");
  }
};

export { setItem, getItem, removeAllItems };
