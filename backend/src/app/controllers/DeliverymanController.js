/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = await Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'User alredy exist!' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const list = await Deliveryman.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(list);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist!' });
    }

    const { name, email } = req.body;

    if (email && email !== deliveryman.email) {
      const UserExist = await Deliveryman.findOne({ where: { email } });

      if (UserExist) {
        return res.status(400).json({ error: 'Deliveryman alredy exist!' });
      }
    }

    await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist!' });
    }

    await deliveryman.destroy(id);

    return res.json({ message: 'Deliveryman was deleted!' });
  }
}

export default new DeliverymanController();
