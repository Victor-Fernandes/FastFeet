/* eslint-disable class-methods-use-this */
import User from '../models/User';

class UserController {
  async store(req, res) {
    const UserExist = await User.findOne({ where: { email: req.body.email } });

    if (UserExist) {
      return res.status(400).json({ error: 'User alredy exist!' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
