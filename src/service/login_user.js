const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.login = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, password } = requestBody;

    // Obtén el usuario con el correo electrónico proporcionado
    const user = await dynamoDB.get({
      TableName: process.env.TABLENAME,
      Key: { email },
    }).promise();

    if (!user.Item) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Authentication error',
          message: 'User not found.',
        }),
      };
    }

    // Compara la contraseña proporcionada con el hash almacenado en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.Item.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Authentication error',
          message: 'Invalid password.',
        }),
      };
    }

    // se genera un token de autenticación JWT
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful.',
        user: {
          email: user.Item.email,
          profileImage: user.Item.profileImage,
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: 'An error occurred while logging in.' }),
    };
  }
};
