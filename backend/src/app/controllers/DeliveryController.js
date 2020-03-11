/* eslint-disable no-dupe-keys */
/* eslint-disable class-methods-use-this */
import Orders from '../models/Orders';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const delivery = await Orders.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null && req.params.id,
        end_date: null,
      },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(delivery);
  }
}

export default new DeliveryController();
