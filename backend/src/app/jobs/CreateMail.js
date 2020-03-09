/* eslint-disable no-dupe-keys */
/* eslint-disable class-methods-use-this */
import Mail from '../../lib/Mail';

class CreateMail {
  get key() {
    return 'CreateMail';
  }

  async handle({ data }) {
    const {
      order: { deliveryman, recipient, product },
    } = data;

    await Mail.sendMail({
      from: 'Equipe FastFeet <noreply@fastfeet.com>',
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novo encomenda liberada!',
      template: 'create',
      context: {
        startedMessage: `Ola ${deliveryman.name}`,
        product: `A encomenda com o produto ${product} está disponivel para retirada`,
        recipientName: recipient.recipient_name,
        recipientStreet: recipient.street,
        recipientNumber: recipient.number,
        recipientComplement: recipient.complement || 'Indisponivel.',
        recipientCity: recipient.state,
        recipientState: recipient.city,
        recipientZipCode: recipient.zip_code,
      },
    });
  }
}

export default new CreateMail();
