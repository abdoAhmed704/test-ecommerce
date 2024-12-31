const multer = require("multer");
const SendError = require("../utils/sendError");

const multerOptions = () => {
  // memoryStorage
  const storage = multer.memoryStorage();

  const fileFilteration = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new SendError("Only images", 400), false);
    }
  };
  const upload = multer({ storage, fileFilter: fileFilteration });
  return upload;
};

exports.uploadOneImage = (fieldname) => multerOptions().single(fieldname);

exports.uploadManyImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
