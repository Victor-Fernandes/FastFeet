/* eslint-disable class-methods-use-this */
import { getHours, isAfter, isBefore, parseISO, startOfHour } from 'date-fns';
import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Orders';

class DeliveryStatusController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(401).json({ error: 'Order does not exist!' });
    }

    const { deliveryman_id, start_date } = req.body;

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(401).json({ error: 'Deliveryman does not exist!' });
    }

    const hourStart = startOfHour(parseISO(start_date));

    // Verificando se start_date já passou
    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted!' });
    }

    // Verificando se start_date é antes das 08:00 ou depois de 18:00
    const startHour = getHours(parseISO(start_date));
    const endHour = getHours(parseISO(start_date));

    if (
      isBefore(startHour, getHours(new Date().setHours(8))) ||
      isAfter(endHour, getHours(new Date().setHours(18)))
    ) {
      return res.status(401).json({ error: 'Out of delivery time!' });
    }

    await order.update({ start_date });
    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      end_date: Yup.date().required(),
      signature_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(401).json({ error: 'Order does not exist!' });
    }

    const { deliveryman_id, signature_id, end_date } = req.body;

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(401).json({ error: 'Deliveryman does not exist!' });
    }

    if (!(await File.findByPk(signature_id))) {
      return res.status(401).json({ error: 'Signature does not exist!' });
    }
    // Verificando se end_date é antes das 08:00 ou depois de 18:00
    const startHour = getHours(parseISO(end_date));
    const endHour = getHours(parseISO(end_date));

    if (
      isBefore(startHour, getHours(new Date().setHours(8))) ||
      isAfter(endHour, getHours(new Date().setHours(18)))
    ) {
      return res.status(401).json({ error: 'Out of delivery time!' });
    }

    await order.update({ end_date, signature_id });

    return res.json(order);
  }
}

export default new DeliveryStatusController();
