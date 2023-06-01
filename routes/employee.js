const express = require('express');

const routes = express.Router();
// file controller
const { getAllEmployees, createEmployee, getFilterest } = require('../controlers/employee');

routes.route('/').get(getAllEmployees).post(createEmployee);
routes.route('/query').get(getFilterest);

module.exports = routes;
