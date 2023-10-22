const {
    verifyToken
} = require("../utils/jwt")

const {
    User
} = require("../models")

const authentication = async(req, res, next) => {
    try {
        // Cek header ada token atai tidak

        const token = req.headers["authorization"]

        if (!token) {
            throw {
                code: 401,
                message: "Token tidak tersedia"
            }
        }

        // verifikasi token
        const decode = verifyToken(token)

        const userData = await User.findOne({
            where: {
                id: decode.id,
                email: decode.email
            }
        })

        if(!userData) {
            throw {
                code: 404,
                message: "User tidak terdaftar"
            }
        }

        req.userData = {
            id: userData.id,
            email: userData.email,
            username: userData.username
        }

        next()

    } catch (error) {
        res.status(error.code || 401).json(error.message)
    }
}

module.exports = {
    authentication
}