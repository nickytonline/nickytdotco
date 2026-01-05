import tokens from "./tokens.json" assert { type: "json" };

export default {
  colors() {
    let response = [];

    Object.keys(tokens.colors).forEach((key) => {
      response.push({
        value: tokens.colors[key],
        key,
      });
    });

    return response;
  },
  sizes() {
    let response = [];

    Object.keys(tokens["size-scale"]).forEach((key) => {
      response.push({
        value: tokens["size-scale"][key],
        key,
      });
    });

    return response;
  },
};
