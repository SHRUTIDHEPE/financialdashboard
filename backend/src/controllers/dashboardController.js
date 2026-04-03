const FinancialRecord = require('../models/FinancialRecord');

// @desc    Get dashboard summary (totals, category-wise, recent activity)
// @route   GET /api/dashboard/summary
// @access  Private (Viewer, Analyst, Admin)
const getDashboardSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get total income and expense
    const [incomeResult, expenseResult] = await Promise.all([
      FinancialRecord.aggregate([
        { $match: { ...dateFilter, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      FinancialRecord.aggregate([
        { $match: { ...dateFilter, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;

    // Category-wise totals
    const categoryTotals = await FinancialRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
        },
      },
      {
        $project: {
          category: '$_id',
          totalIncome: '$income',
          totalExpense: '$expense',
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { category: 1 } },
    ]);

    // Recent activity (last 5 transactions)
    const recentActivity = await FinancialRecord.find(dateFilter)
      .sort('-date')
      .limit(5)
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netBalance,
        },
        categoryTotals,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly trends
// @route   GET /api/dashboard/trends
// @access  Private (Viewer, Analyst, Admin)
const getMonthlyTrends = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const trends = await FinancialRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
        },
      },
      {
        $project: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1,
                },
              },
            },
          },
          income: 1,
          expense: 1,
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly trends (last 12 weeks)
// @route   GET /api/dashboard/trends/weekly
// @access  Private (Viewer, Analyst, Admin)
const getWeeklyTrends = async (req, res, next) => {
  try {
    const { weeks = 12 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(weeks) * 7);
    startDate.setHours(0, 0, 0, 0);

    const trends = await FinancialRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $addFields: {
          week: { $isoWeek: '$date' },
          year: { $isoWeekYear: '$date' },
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            week: '$week',
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            week: '$_id.week',
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
        },
      },
      {
        $project: {
          week: {
            $concat: [
              { $toString: '$_id.year' },
              '-W',
              {
                $cond: {
                  if: { $lt: ['$_id.week', 10] },
                  then: { $concat: ['0', { $toString: '$_id.week' }] },
                  else: { $toString: '$_id.week' },
                },
              },
            ],
          },
          income: 1,
          expense: 1,
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { week: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getMonthlyTrends,
  getWeeklyTrends,
};