import { useContext } from 'react';
import { Form, FormRow, Button, Icon, PopupTrigger, Popup } from 'react-basics';
import Icons from '@/components/icons';
import { ReportContext } from '../[reportId]/Report';
import BaseParameters from '../[reportId]/BaseParameters';
import ParameterList from '../[reportId]/ParameterList';
import PopupForm from '../[reportId]/PopupForm';
import FieldSelectForm from '@/app/(main)/reports/[reportId]/FieldSelectForm';
import { useMessages, useFields } from '@/components/hooks';

export default function BreakdownParameters() {
  const { report, updateReport } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();
  const { fields } = useFields();

  const {
    parameters: { fields: selectedFields = ['path'] },
  } = report || {};

  const handleAddField = (field: any) => {
    const newFields = [...(selectedFields || []), field.name];
    updateReport({ parameters: { ...report.parameters, fields: newFields } });
  };

  const handleRemoveField = (fieldName: string) => {
    const newFields = selectedFields.filter((name: string) => name !== fieldName);
    updateReport({ parameters: { ...report.parameters, fields: newFields } });
  };

  const availableFields = fields.filter(
    (field: any) => !selectedFields.includes(field.name),
  );

  return (
    <Form>
      <BaseParameters />
      <FormRow
        label={formatMessage(labels.fields)}
        action={
          availableFields.length > 0 && (
            <PopupTrigger>
              <Button>
                <Icon>
                  <Icons.Plus />
                </Icon>
              </Button>
              <Popup alignment="start">
                <PopupForm>
                  <FieldSelectForm fields={availableFields} onSelect={handleAddField} />
                </PopupForm>
              </Popup>
            </PopupTrigger>
          )
        }
      >
        <ParameterList>
          {selectedFields.map((fieldName: string) => {
            const field = fields.find((f: any) => f.name === fieldName);
            return (
              <ParameterList.Item
                key={fieldName}
                onRemove={() => handleRemoveField(fieldName)}
              >
                {field?.label || fieldName}
              </ParameterList.Item>
            );
          })}
        </ParameterList>
      </FormRow>
    </Form>
  );
}

