//definir a logica de acesso a base de dados
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const secretKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas!' });
        }

        //definir método para comparar no modelo do User
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas!' });
        }

        // Geração de token
        const token = jwt.sign(
            { id: user._id, username: user.email, role: user.role },
            secretKey,
            { expiresIn: '24h' }
        );

        res.json({ success: true, accessToken: token });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor!' });
    }
};

exports.registo = (req, res) => {
    console.log("Tentativa de registo:", req.body);
};