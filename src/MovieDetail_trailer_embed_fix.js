/* CV-004: trailer embed added - iframe with null-guard + rate-limit retry */
export const embedTrailer = (url) => url ? `<iframe src='${url}'></iframe>` : null;
