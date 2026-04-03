const FinancialRecord = require('../models/FinancialRecord');

// @desc    Get all financial records with filtering and pagination
// @route   GET /api/records
// @access  Private (Analyst and Admin)
const getRecords = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      search,
    } = req.query;

    const query = {};

    // Apply filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const records = await FinancialRecord.find(query)
      .populate('createdBy', 'name email')
      .sort('-date')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FinancialRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single financial record
// @route   GET /api/records/:id
// @access  Private (Analyst and Admin)
const getRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id).populate('createdBy', 'name email');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a financial record
// @route   POST /api/records
// @access  Private/Admin
const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, description } = req.body;

    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date: date || Date.now(),
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a financial record
// @route   PUT /api/records/:id
// @access  Private/Admin
const updateRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const record = await FinancialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found',
      });
    }

    // Update fields
    if (amount) record.amount = amount;
    if (type) record.type = type;
    if (category) record.category = category;
    if (date) record.date = date;
    if (description) record.description = description;

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Financial record updated successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a financial record
// @route   DELETE /api/records/:id
// @access  Private/Admin
const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Financial record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};