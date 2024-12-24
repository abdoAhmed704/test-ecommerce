class ApiFeatures {
  constructor(mongooseQuery, queryObject) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryObject;
    this.page = 0;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedKeys = ["limit", "sort", "page", "fields"];
    excludedKeys.forEach((key) => delete queryStringObj[key]);

    const queryString = JSON.stringify(queryStringObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const { keyword } = this.queryString;
      let query;

      if (["Products", "Review"].includes(modelName)) {
        query = {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        };
      } else {
        query = { name: { $regex: keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = Math.max(this.queryString.page * 1 || 1, 1);
    const limit = this.queryString.limit * 1 || 15;
    const skip = (page - 1) * limit;

    this.paginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (skip + limit < countDocuments) {
      this.paginationResult.next = page + 1;
    }

    if (skip > 0) {
      this.paginationResult.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
