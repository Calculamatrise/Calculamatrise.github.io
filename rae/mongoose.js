import { mongoose } from '../node_modules/mongoose/index.js';

var mongo = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect('mongodb+srv://Rae:dashboard@cluster0.ehbdq.mongodb.net/Rae?retryWrites=true&w=majority', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Lost connection to the Database');
        });
    }
}
export { mongo }