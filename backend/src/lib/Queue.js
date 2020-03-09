/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import Bee from 'bee-queue';

import CreateMail from '../app/jobs/CreateMail';
import redisConfig from '../config/redis';

const jobs = [CreateMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // bee connecta com o redis, que armazena e recupera valores
  // handle -> processa as filas
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  //
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa os jobs em background
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  // monitora erros nas filas
  handleFailure(job, error) {
    console.log(`Queue ${job.queue.name}: Failed`, error);
  }
}

export default new Queue();
