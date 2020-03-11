/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
// import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Queue from '../../lib/Queue';
import CreateMail from '../jobs/CreateMail';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Orders';
import Recipient from '../models/Recipients';

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

  async index(req, res) {
    const { page = 1 } = req.query;

    const list = await Order.findAll({
      order: ['id'],
      limit: 20, // limitando itens por page
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
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
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(list);
  }

  async update(req, res) {
    const schema = await Yup.object().shape({
      recipient_id: Yup.number().integer(),
      deliveryman_id: Yup.number().integer(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(401).json({ error: 'Order does not exist!' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: 'Recipient does not exist.' });
    }

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'Deliveryman does not exist.' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(401).json({ error: 'Order does not exist!' });
    }

    await order.destroy(id);

    return res.json({ message: 'Order was deleted!' });
  }
}

export default new OrderController();
