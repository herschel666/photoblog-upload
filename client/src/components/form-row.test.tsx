import React from 'react';
import { render } from '@testing-library/react';

import { FormRow } from './form-row';

it('renders the passed input', () => {
  const label = 'Test';
  const { getAllByLabelText } = render(
    <FormRow id="test" label={label}>
      <input id="test" placeholder="Test..." />
    </FormRow>
  );

  getAllByLabelText(label);
});
