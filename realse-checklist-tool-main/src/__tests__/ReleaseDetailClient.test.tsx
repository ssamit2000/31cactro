import { render, screen, fireEvent } from '@testing-library/react';
import ReleaseDetailClient from '@/app/releases/[id]/ReleaseDetailClient';

const mockRelease = {
  id: '1',
  name: 'Test Release',
  date: new Date().toISOString(),
  status: 'planned',
  additionalInfo: '',
  completedSteps: [],
};

test('renders release name and steps', () => {
  render(<ReleaseDetailClient release={mockRelease} status="planned" />);

  expect(screen.getByText('Test Release')).toBeInTheDocument();
  expect(screen.getByText('Steps')).toBeInTheDocument();
});

test('toggles step checkbox', () => {
  render(<ReleaseDetailClient release={mockRelease} status="planned" />);
  
  const checkbox = screen.getByRole('checkbox', { name: 'Step 1' });
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
});