const getDB = require('../../ddbb/db.js');

const getUser = async (req, res, next) => {
    
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [user] = await connection.query(`
            SELECT id, name, email, avatar, biografia, role, createdAt FROM users WHERE id = ?
        `, [idUser]);
        
        const userInfo = {
            name: user[0].name,
            avatar: user[0]. avatar,
            biografia: user[0].biografia
        };

        if(user[0].id === req.userAuth.idUser || req.userAuth.role === 'admin') {
            userInfo.email = user[0].email;
            userInfo.role = user[0].role;
            userInfo.createdAt = user[0].createdAt;
        };

        res.send ({
            status: 'ok',
            data: userInfo
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = getUser;