//configuración para el cuerpo de la tabla que se enviara a dynamoDB

export const params = {
  TableName: 'USERS', 
  AttributeDefinitions: [
    {
      AttributeName: 'email',
      AttributeType: 'S', 
    },
  ],
  KeySchema: [
    {
      AttributeName: 'email',
      KeyType: 'HASH', },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5, // Capacidad de lectura
    WriteCapacityUnits: 5, // Capacidad de escritura
  },
};