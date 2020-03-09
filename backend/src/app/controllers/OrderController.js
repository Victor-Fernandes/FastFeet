/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';

import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
// import File from '../models/File';
import Recipient from '../models/Recipients';

import CreateMail from '../jobs/CreateMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = await Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .required(),
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: 'Recipient does not exist.' });
    }

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'Deliveryman does not exist.' });
    }

    const { id, product } = await Order.create(req.body);

    const order = await Order.findByPk(id, {
      attributes: ['product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'recipient_name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    await Queue.add(CreateMail.key, {
      order,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }
}

export default new OrderController();
