const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 1------------> DiskStorage
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/category");
  //   },
  //   filename: function (req, file, cb) {
  //     // category-{id}-Date.now.ext
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  // 2------------> memoryStorage
  const storage = multer.memoryStorage();

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image Allowed", 400), false);
    }
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};


exports.uploadSingleImage = (fieldname) =>
  multerOptions().single(fieldname);

exports.uploadMultipleImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

