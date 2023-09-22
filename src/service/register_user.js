const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.register = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { name, lastname, email, password } = requestBody;

    if (!validateEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation error',
          message: 'Invalid email address.',
        }),
      };
    }

    if (!validatePassword(password)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation error',
          message: 'The password must contain at least 8 characters and a combination of letters and numbers.',
        }),
      };
    }

    const existingUser = await dynamoDB.query({
      TableName: process.env.TABLENAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :e',
      ExpressionAttributeValues: { ':e': email },
    }).promise();

    if (existingUser.Items && existingUser.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Duplication error', message: `The email '${email}' is already registered in the system.` }),
      };
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: process.env.TABLENAME,
      Item: {
        id: Date.now().toString(),
        name,
        lastname,
        email,
        password: hashedPassword,
        profileImage: generateRandomProfileImage(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successful registration.',
        user: {
          id: params.Item.id,
          email: params.Item.email,
          profileImage: params.Item.profileImage,
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: 'An error occurred while registering the user.' }),
    };
  }
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const minLength = 8;
  const specialCharactersRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/;
  return password.length >= minLength && specialCharactersRegex.test(password);
}

function generateRandomProfileImage() {
  return 'https://url-imagen-de-perfil-aleatoria.com/imagen.jpg';
}
