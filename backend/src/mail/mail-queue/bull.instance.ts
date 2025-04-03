const Queue = require('bull'); //Es igual que un import, el import no lo hago porque hay que modificar el tsconfig

// Esta es la instancia real de la cola
export const mailQueue = new Queue('mail-queue', {
  redis: {
    host: 'redis', // mismo nombre que en docker-compose
    port: 6379,
  },
});