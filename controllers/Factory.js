const asyncHandler = require("express-async-handler");
const SendError = require("../utils/sendError");
const ApplyFeatures = require("../utils/applyFeatures");

exports.deleteOneByIdOf = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const thing = await Model.findByIdAndDelete(id);

    if (!thing) {
      return next(new SendError(`No document for that id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOneById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const thing = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!thing) {
      return next(
        new SendError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: thing });
  });

exports.createOneOf = (Model) =>
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const newThing = await Model.create(req.body);
    res.status(201).json({ data: newThing });
  });

exports.getOneByIdOf = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const thing = await Model.findById(id);
    if (!thing) {
      return next(new SendError(`There is no document for this id ${id}`, 404));
    }
    res.status(200).json({ data: thing });
  });

exports.getAllOf = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filteration = {};
    if (req.filtration) {
      filteration = req.filtration;
    }
    const numberOfDocuments = await Model.countDocuments();
    const applyFeatures = new ApplyFeatures(Model.find(filteration), req.query)
      .paginateResults(numberOfDocuments)
      .applyFilters()
      .applySearch(modelName)
      .limitSelectionFields()
      .applySorting();

    // Execute query
    const { query: mongooseQuery, paginationResult } = applyFeatures;
    const documents = await mongooseQuery;
    console.log("Final Mongoose Query:", mongooseQuery.getQuery());

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
