import { useState } from 'react';
import { Button, Icon, Text, useToasts, TextField, Loading, Icons } from 'react-basics';
import { useApi, useMessages } from '@/components/hooks';
import styles from './ApiKeySetting.module.css';

export function ApiKeySetting() {
  const { formatMessage, labels, messages } = useMessages();
  const { showToast } = useToasts();
  const { get, post, del, useQuery, useMutation } = useApi();
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['api-key'],
    queryFn: () => get('/auth/api-keys'),
  });

  const generateMutation = useMutation({
    mutationFn: () => post('/auth/api-keys'),
    onSuccess: (data: any) => {
      setNewApiKey(data.apiKey);
      setShowApiKey(true);
      refetch();
      showToast({
        message: formatMessage(messages.saved),
        variant: 'success',
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => del('/auth/api-keys'),
    onSuccess: () => {
      setNewApiKey(null);
      setShowApiKey(false);
      refetch();
      showToast({
        message: 'API key revoked successfully',
        variant: 'success',
      });
    },
  });

  const handleGenerate = () => {
    if (data?.hasApiKey) {
      if (confirm('Generating a new API key will revoke your existing key. Continue?')) {
        generateMutation.mutate();
      }
    } else {
      generateMutation.mutate();
    }
  };

  const handleRevoke = () => {
    if (confirm('Are you sure you want to revoke your API key? This action cannot be undone.')) {
      revokeMutation.mutate();
    }
  };

  const handleCopy = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      showToast({
        message: 'API key copied to clipboard',
        variant: 'success',
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const hasApiKey = data?.hasApiKey || false;

  return (
    <div className={styles.container}>
      {showApiKey && newApiKey && (
        <div className={styles.newKeyContainer}>
          <div className={styles.warning}>
            <Icon>
              <Icons.Alert />
            </Icon>
            <Text>
              <strong>Important:</strong> Save this API key now. You won't be able to see it again!
            </Text>
          </div>
          <div className={styles.keyDisplay}>
            <TextField value={newApiKey} readOnly />
            <Button onClick={handleCopy}>
              <Icon>
                <Icons.Copy />
              </Icon>
              <Text>Copy</Text>
            </Button>
          </div>
          <Button onClick={() => setShowApiKey(false)} variant="secondary">
            I've saved it
          </Button>
        </div>
      )}
      {!showApiKey && (
        <div className={styles.actions}>
          {hasApiKey ? (
            <>
              <div className={styles.status}>
                <Icon>
                  <Icons.Check />
                </Icon>
                <Text>API key is active</Text>
                <Text className={styles.maskedKey}>{data?.maskedKey}</Text>
              </div>
              <div className={styles.buttons}>
                <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
                  <Icon>
                    <Icons.Refresh />
                  </Icon>
                  <Text>Regenerate</Text>
                </Button>
                <Button
                  onClick={handleRevoke}
                  variant="danger"
                  disabled={revokeMutation.isPending}
                >
                  <Icon>
                    <Icons.Close />
                  </Icon>
                  <Text>Revoke</Text>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Text>No API key generated</Text>
              <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
                <Icon>
                  <Icons.Plus />
                </Icon>
                <Text>Generate API Key</Text>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiKeySetting;

