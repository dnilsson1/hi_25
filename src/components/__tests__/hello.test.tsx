import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Hello from '../Hello';

describe('Hello Component', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Hello />);
        expect(getByText('Hello, World!')).toBeInTheDocument();
    });

    it('displays the correct greeting', () => {
        const { getByText } = render(<Hello name="Alice" />);
        expect(getByText('Hello, Alice!')).toBeInTheDocument();
    });
});