/* eslint-disable no-dupe-keys */
/* eslint-disable class-methods-use-this */
import Mail from '../../lib/Mail';

class CreateMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const {
      order: { name, email, product },
    } = data;

    await Mail.sendMail({
      from: 'Equipe FastFeet <noreply@fastfeet.com>',
      to: `${name} <${email}>`,
      subject: 'Entrega cancelada!',
      template: 'cancellation',
      context: {
        startedMessage: `Ola ${name}`,
        product: `A encomenda com o produto ${product} foi cancelada!`,
      },
    });
  }
}

export default new CreateMail();
