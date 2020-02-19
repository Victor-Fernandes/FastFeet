/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';

import Recipients from '../models/Recipients';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .required()
        .positive()
        .integer(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .required()
        .length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fail create new recipient!' });
    }

    const {
      id,
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipients.create(req.body);

    return res.json({
      id,
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_name: Yup.string(),
      street: Yup.string(),
      number: Yup.number()
        .positive()
        .integer(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string().length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fail update a recipient!' });
    }
    const { id } = req.params;

    const recipient = await Recipients.findByPk(id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist!' });
    }

    const {
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientsController();
