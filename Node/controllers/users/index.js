const getUser = require('./getUser');
const newUser = require('./newUser');
const validateUsers = require('./validateUsers');
const loginUser = require('./loginUser');
const editPassword = require('./editPassword');
const recoverUser = require('./recoverUser');
const recoverPass = require('./recoverPass');
const deleteUser = require('./deleteUser');

module.exports = {
    getUser,
    newUser,
    validateUsers,
    loginUser,
    editPassword,
    recoverUser,
    recoverPass,
    deleteUser
};