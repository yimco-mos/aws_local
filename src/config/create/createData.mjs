import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { params } from '../../models/model.mjs';
import dotenv from 'dotenv'
dotenv.config();

//importamos params de models para crear una estructura de la tabla y los enviamos
//corriendo el comando   npm run create_database
//por medio de una funcion autoejecutable se crea la tabla

//modulo dotenv para guardar las variables de entorno


(async () => {
  const dynamoDB = new DynamoDBClient({
    region: process.env.PORT, 
    endpoint: process.env.PORT, 
    credentials: {
      accessKeyId: process.env.ACCESS_ID , 
            secretAccessKey: process.env.ACCESS_KEY , 
    
    
          },
  }
  
  );

  try {
    await dynamoDB.send(new CreateTableCommand(params)); // metodo para crear la tabla
    console.log('La tabla ha sido creaa exitosamente.');
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
})();
