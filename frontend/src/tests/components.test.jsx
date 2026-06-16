import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card';

describe('Button Component', () => {
  it('renders the button with children text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();
  });
});

describe('Badge Component', () => {
  it('renders correctly with children', () => {
    render(<Badge>Eco Friendly</Badge>);
    expect(screen.getByText('Eco Friendly')).toBeInTheDocument();
  });

  it('renders dot when specified', () => {
    render(<Badge dot>Eco Friendly</Badge>);
    const badge = screen.getByText('Eco Friendly');
    expect(badge.querySelector('span')).toBeInTheDocument();
  });
});

describe('Card Component', () => {
  it('renders card with body, header and title structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Eco Title</CardTitle>
        </CardHeader>
        <CardBody>Eco Details</CardBody>
      </Card>
    );
    expect(screen.getByRole('heading', { name: /eco title/i })).toBeInTheDocument();
    expect(screen.getByText('Eco Details')).toBeInTheDocument();
  });
});
