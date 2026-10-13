import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./service/apiCliente', () => ({
  listarClientes: jest.fn().mockResolvedValue([]),
}));

jest.mock('./service/apiDelivery', () => ({
  listarDelivery: jest.fn().mockResolvedValue([]),
  atualizaDelivery: jest.fn(),
}));

jest.mock('./service/apiTicket', () => ({
  listarTickets: jest.fn().mockResolvedValue([]),
  atualizaTicket: jest.fn(),
  isTicketFinalizado: jest.fn().mockReturnValue(false),
  isTicketBaixado: jest.fn().mockReturnValue(false),
}));

test('renders the laundry dashboard', () => {
  render(<App />);
  expect(screen.getByText(/Sistema de Lavanderia/i)).toBeInTheDocument();
});
