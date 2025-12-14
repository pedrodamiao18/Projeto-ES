//definir a logica de acesso a base de dados
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const secretKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: 'Email inválido!' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Password inválida!' });
        }

        // Geração de token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            secretKey,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            //impede que o javascript possa aceder ao cookie
            httpOnly: true,
            //secure: true,
            //só enviamos o cookie para o servidos se a conexão for https
            maxAge: 24 * 60 * 60 * 1000 //24 horas
        })

        res.json({ success: true, message: "Login com sucesso." });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor!' });
    }
};

exports.registo = (req, res) => {
    const { nome, email, password } = req.body;

    const newUser = new User({
        name: nome,
        email: email,
        password: password,
        role: "cliente"
    });

    newUser.save()
        .then(() => {
            console.log("Registo realizado com sucesso!");

            res.status(201).json({
                success: true,
                message: "Registo efetuado com sucesso!",
            });
        })
        .catch((err) => {
            console.error("Erro ao criar novo utilizador:", err);

            res.status(500).json({
                error: 'Erro no servidor ou dados inválidos!'
            });
        });
};

//esconder o formulario login e fazer aparecer cena de "a carregar"
// e depois mudar conforme esteja ou nao autenticado
exports.isLoggedIn = (req, res) => {
    //só passa pelo middleware se estiver autenticado

    res.status(200).json({
        isLoggedIn: true,
        user: req.user
    });
}