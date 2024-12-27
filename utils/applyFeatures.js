class ApplyFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryString = queryObject;
    this.page = 0;
  }

  applyFilters() {
    const queryStringObj = { ...this.queryString };
    const rejectKeys = ["limit", "sort", "fields", "page", "keyword"];
    rejectKeys.forEach((k) => delete queryStringObj[k]);

    const queryString = JSON.stringify(queryStringObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  applySorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitSelectionFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  applySearch(modelName) {
    if (this.queryString.keyword) {
      const { keyword } = this.queryString;
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      let someData;
      if (["Products", "Review"].includes(modelName)) {
        someData = {
          $or: [
            { title: { $regex: escapedKeyword, $options: "i" } },
            { description: { $regex: escapedKeyword, $options: "i" } },
          ],
        };
      } else {
        someData = { name: { $regex: escapedKeyword, $options: "i" } };
      }

      // Debug constructed query
      console.log(
        "Constructed Search Query (someData):",
        JSON.stringify(someData, null, 2)
      );

      // Apply the search query and serialize it
      this.query = this.query.find(JSON.parse(JSON.stringify(someData)));

      // Debugging after applying the query
      console.log("Query Object After Find:", this.query.getQuery());
    }
    return this;
  }

  paginateResults(countDocuments) {
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

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApplyFeatures;
