const express = require('express');
const morgan = require('morgan');
const { swaggerUi, specs } = require('./swagger'); // Importe a configuração do Swagger
const app = express();
const port = 3000;

// Middleware para parsing de parâmetros de consulta
app.use(express.json());

// Configuração personalizada do morgan para incluir o IP do cliente
morgan.format('custom', ':remote-addr :method :url :status :response-time ms');
app.use(morgan('custom')); // Usa o formato personalizado para o log

// Rota para a documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Endpoint de cálculo
/**
 * @openapi
 * /calculate:
 *   get:
 *     summary: Realiza um cálculo simples
 *     parameters:
 *       - name: num1
 *         in: query
 *         description: Primeiro número
 *         required: true
 *         schema:
 *           type: number
 *       - name: num2
 *         in: query
 *         description: Segundo número
 *         required: true
 *         schema:
 *           type: number
 *       - name: operation
 *         in: query
 *         description: Operação matemática a ser realizada
 *         required: true
 *         schema:
 *           type: string
 *           enum: [+, -, x, /]  # Define os valores possíveis para operação
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: number
 *       400:
 *         description: Erro na solicitação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


// pegando a variarel app e setando um get nela para definir os parametros para desenvolver a API.
app.get('/imc', (req, res, next) => {
    try {
        const { peso, altura} = req.query;


        // definindo erro se nenhum parametro for informado no React.
        if (peso === undefined || altura === undefined ) {
            throw new Error('Parâmetros insuficientes!');
        }

        // definindo que pesoNumber e alturaNumber são numeros reais e serão utilizados em calculos.
        const pesoNumber = parseFloat(peso);
        const alturaNumber = parseFloat(altura);

       //Se o valor não ser um numero será retonado "Parametros inválidos".
        if (isNaN(pesoNumber) || isNaN(alturaNumber)) {
            throw new Error('Parâmetros inválidos!');
        }

        //Definindo a variavel imc como imutavel, pois trata-se de uma operação matematica.
        const imc = peso / (altura * altura);

        //Definindo uma variavel para receber os resultados da conta imc
        let result1;
         

        //Passando if para analisar o resultado e retornar uma mensagem caso o imc dê determinados resultados. 
        if (imc < 18.5) {
            result1 = `${imc} - Abaixo do peso`;
        } else if (imc >= 18.5 && imc < 24.9) {
            result1 = `${imc} - Peso normal`;
        } else if (imc >= 25 && imc < 29.9) {
            result1 = `${imc} - Sobrepeso`;
        } else { 
            result1 = `${imc} - Obesidade`;
        }

        //Passando res.json para devolver o resultado tanto do calculco imc quanto do if no navegador ou na propria aplicação.
        res.json({result1});
    } catch (error) {
        next(error); 
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Log do erro
    res.status(400).json({ error: err.message }); // Responde com a mensagem de erro
});
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});


