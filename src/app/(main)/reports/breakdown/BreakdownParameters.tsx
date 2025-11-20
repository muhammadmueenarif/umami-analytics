import { useContext } from 'react';
import { Form, FormRow } from 'react-basics';
import { ReportContext } from '../[reportId]/Report';
import BaseParameters from '../[reportId]/BaseParameters';
import ParameterList from '../[reportId]/ParameterList';
import { useMessages, useFields } from '@/components/hooks';

export default function BreakdownParameters() {
  const { report, updateReport } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();
  const { fields } = useFields();

  const {
    parameters: { fields: selectedFields = ['path'] },
  } = report || {};

  const handleFieldsChange = (values: string[]) => {
    updateReport({ parameters: { fields: values } });
  };

  const fieldOptions = fields.map(({ name, label }) => ({
    label,
    value: name,
  }));

  return (
    <Form>
      <BaseParameters />
      <FormRow label={formatMessage(labels.fields)}>
        <ParameterList
          items={fieldOptions}
          value={selectedFields}
          onChange={handleFieldsChange}
        />
      </FormRow>
    </Form>
  );
}

