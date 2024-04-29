import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
   console.error(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res
        .status(422) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.ROUTING_ERROR:
      res
        .status(404) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.DATABASE_ERROR:
      res
        .status(500) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.LOGIN_ERROR:
      res
        .status(401) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.DELETING_PRODUCT_ERROR:
      res
        .status(422) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.ADD_PRODUCT_ERROR:
      res
        .status(422) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.EDITING_PRODUCT_ERROR:
      res
        .status(422) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.DUPLICATE_CODE_ERROR:
      res
        .status(409) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    case EErrors.ADDING_PRODUCT_TO_CART_ERROR:
      res
        .status(422) 
        .json({ status: "error", error: error.name, message: error.message });
      break;
    default:
      res.status(500).json({ status: "error", error: "Error no contemplado" });
      break;
  }
};
