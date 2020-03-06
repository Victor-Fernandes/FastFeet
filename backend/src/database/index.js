import Sequelize from 'sequelize';

import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';
import Orders from '../app/models/Orders';
import Recipients from '../app/models/Recipients';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [Deliveryman, User, Recipients, File, Orders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
