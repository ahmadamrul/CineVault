/* CV-004: null-guard on image URLs */
export const safeImage = (url) => url || '/placeholder.png';
