export const paymentMethods = [
  'Dinheiro',
  'Cartão de crédito',
  'Cartão de débito',
];

export const tagOptions = [
  'Alimentação',
  'Lazer',
  'Trabalho',
  'Transporte',
  'Saúde',
];

export const defaultFormInputs = {
  value: '',
  description: '',
  currency: 'USD',
  method: paymentMethods[0],
  tag: tagOptions[0],
};

export const tableHeaderList = [
  'Descrição', 'Tag', 'Método de pagamento',
  'Valor', 'Moeda', 'Câmbio utilizado',
  'Valor convertido', 'Moeda de conversão', 'Editar/Excluir',
];

export function fixNumber(number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}
