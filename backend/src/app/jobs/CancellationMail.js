/* eslint-disable no-dupe-keys */
/* eslint-disable class-methods-use-this */
import Mail from '../../lib/Mail';

class CreateMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const {
      order: { deliveryman, product },
    } = data;

    await Mail.sendMail({
      from: 'Equipe FastFeet <noreply@fastfeet.com>',
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cancelada!',
      template: 'cancellation',
      context: {
        startedMessage: `Ola ${deliveryman.name}`,
        product: `A encomenda com o produto ${product} foi cancelada!`,
      },
    });
  }
}

export default new CreateMail();
