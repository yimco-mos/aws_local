const { register } = require('./register_user'); // Asegúrate de usar la ruta correcta

describe('register function', () => {
  it('should register a user successfully', async () => {
    // Simula el evento que se pasa a la función
    const event = {
      body: JSON.stringify({
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    };

    // Simula el objeto DynamoDB para la función DocumentClient
    const mockDocumentClient = {
      query: jest.fn().mockReturnValue({ Items: [] }),
      put: jest.fn().mockReturnValue({ promise: jest.fn() }),
    };

    // Simula el objeto AWS
    const mockAWS = {
      DynamoDB: {
        DocumentClient: jest.fn(() => mockDocumentClient),
      },
    };

    // Simula el objeto bcrypt
    const mockBcrypt = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
    };

    // Simula el objeto jsonwebtoken
    const mockJwt = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    // Asigna los objetos simulados a las dependencias
    jest.mock('aws-sdk', () => mockAWS);
    jest.mock('bcrypt', () => mockBcrypt);
    jest.mock('jsonwebtoken', () => mockJwt);

    // Llama a la función
    const result = await register(event);

    // Verifica que la función haya realizado las operaciones esperadas
    expect(result.statusCode).toBe(200);
    expect(mockDocumentClient.query).toHaveBeenCalled();
    expect(mockDocumentClient.put).toHaveBeenCalled();
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockJwt.sign).toHaveBeenCalled();
  });
});
