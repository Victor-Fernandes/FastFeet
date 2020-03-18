/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Orders';
import Recipients from '../models/Recipients';

class DeliveryProblemsController {
  async store(req, res) {
    const schema = await Yup.object().shape({
      delivery_id: Yup.number()
        .integer()
        .required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    if (!(await Deliveryman.findByPk(id))) {
      return res.status(400).json({ error: 'Deliveryman does not exist.' });
    }

    const { delivery_id, description } = req.body;

    if (!(await Order.findByPk(delivery_id))) {
      return res.status(400).json({ error: 'Order does not exist.' });
    }

    await DeliveryProblems.create(req.body);

    return res.json({ delivery_id, description });
  }

  async index(req, res) {
    const { id } = req.params;

    if (!(await Order.findByPk(id))) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not exist.' });
    }

    const problemslist = await DeliveryProblems.findAll({
      where: { delivery_id: id },
    });

    return res.json(problemslist);
  }

  async delete(req, res) {
    const deliveryProblems = await DeliveryProblems.findByPk(req.params.id);

    if (!deliveryProblems) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not exist.' });
    }

    const order = await Order.findByPk(deliveryProblems.delivery_id, {
      include: [
        // lembrar de incluir os 2 models
        { model: Deliveryman, as: 'deliveryman' },
        { model: Recipients, as: 'recipient' },
      ],
    });

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }
}

export default new DeliveryProblemsController();
