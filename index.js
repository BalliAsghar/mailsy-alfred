import alfy from "alfy";

import utils from "./utils/index.js";

const query = alfy.input;

switch (query) {
  case "g":
    utils.createAccount();
    break;
  case "d":
    utils.deleteAccount();
    break;
  case "m":
    utils.showMessages();
    break;
  case "me":
    utils.showMe();
    break;
}
