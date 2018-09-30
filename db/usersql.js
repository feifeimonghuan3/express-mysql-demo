module.exports = {
    insert:'INSERT INTO user(id,name,age) VALUES(?,?,?)',
    queryAll:'SELECT * FROM user',
    getUserById:'SELECT * FROM User WHERE id = ? ',
};
