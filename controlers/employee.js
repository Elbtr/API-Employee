const Employees = require("../models/Employee");
const { StatusCodes } = require("http-status-codes");

const getAllEmployees = async (req, res) => {
  const employees = await Employees.find({});
  res.status(StatusCodes.OK).json({ employees, count: employees.length });
};

const createEmployee = async (req, res) => {
  const employee = await Employees.create(req.body);

  res.status(StatusCodes.CREATED).json({ employee });
};

const getFilterest = async (req, res) => {
  const {
    name,
    active,
    startDate,
    endDate,
    status,
    divisi,
    sort,
    fields,
    numericFilters,
  } = req.query;

  try {
    const queryObject = {};
    const queryDate = {};

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
      // queryObject.name = { $ne: name };
    }
    if (active) {
      queryObject.active = active === "true" ? true : false;
    }
    if (divisi) {
      const divisiArray = divisi.split(",");
      queryObject.divisi = { $in: divisiArray };
    }

    if (status) {
      queryObject.status = status;
    }

    if (startDate && endDate) {
      const searchStartDate = { $gte: startDate, $lte: endDate };
      queryObject["deuDate.startDate"] = searchStartDate;
    }

    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };

      const regEx = /\b(<|>|=|<=|>=)\b/g;
      let filter = numericFilters.replace(
        regEx,
        (match) => `_${operatorMap[match]}_`
      );
      const options = [
        "name",
        "status",
        "active",
        "divisi",
        "startDate",
        "endDate",
      ];

      filter = filter.split(",").forEach((item) => {
        const [field, operator, value] = item.split("_");
        // console.log(item.split("_"));
        if (options.includes(field)) {
          if (field === "name") {
            queryObject[field] = { $regex: value, $options: "i" };
          } else if (field === "startDate" || field === "endDate") {
            const dateData = { [field]: value };
            if (!queryDate.dueDate) {
              queryDate.dueDate = {};
            }
            if (field === "startDate") {
              queryDate.dueDate[operator] = value;
            } else if (field === "endDate") {
              queryDate.dueDate[operator] = value;
            }
            queryObject["deuDate.startDate"] = queryDate.dueDate;
          } else {
            queryObject[field] = { [operator]: value };
          }
        }
      });
    }
    console.log(queryObject);

    let result = Employees.find(queryObject);

    if (sort) {
      const sortObject = sort.split(",").join(" ");
      result = result.sort(sortObject);
    }

    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const employee = await result;

    res.status(200).json({ employee, count: employee.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getAllEmployees, createEmployee, getFilterest };
