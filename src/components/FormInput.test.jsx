import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from './formInput';

describe('FormInput Component', () => {
  const defaultProps = {
    id: 'email',
    label: 'Email',
    type: 'email',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Enter email',
    required: true,
    error: 'Email is required',
    className: 'custom-class',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders label and input with correct props', () => {
    render(<FormInput {...defaultProps} />);

    // Get the input by label text
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveClass('auth__input auth__input--error');

    // Get the label associated with this input
    const label = input.labels[0]; // <- safer than getByText
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('auth__label auth__label--required');
  });

  test('applies custom className', () => {
    render(<FormInput {...defaultProps} />);
    const wrapper = screen.getByLabelText(/email/i).closest('div');
    expect(wrapper).toHaveClass('auth__group custom-class');
  });

  test('renders error message if error prop is provided', () => {
    render(<FormInput {...defaultProps} />);
    const error = screen.getByText(/email is required/i);
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('auth__error');
  });

  test('calls onChange when typing', async () => {
    render(<FormInput {...defaultProps} value="" />);
    const input = screen.getByLabelText(/email/i);

    await userEvent.type(input, 'test@example.com');

    expect(defaultProps.onChange).toHaveBeenCalledTimes('test@example.com'.length);

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'email',
          value: expect.any(String),
        }),
      })
    );
  });

  test('does not render error span if error is empty', () => {
    const props = { ...defaultProps, error: '' };
    render(<FormInput {...props} />);
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });

  test('renders label without required class if required=false', () => {
    const props = { ...defaultProps, required: false };
    render(<FormInput {...props} />);
    const input = screen.getByLabelText(/email/i);
    const label = input.labels[0];
    expect(label).not.toHaveClass('auth__label--required');
  });
});
