/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';

import Recipients from '../models/Recipients';

class RecipentsController {
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

    const recipients = await Recipients.create(req.body);

    return res.json({ recipients });
  }
}

export default new RecipentsController();
