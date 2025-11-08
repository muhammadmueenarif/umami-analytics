import {
  Form,
  FormRow,
  FormInput,
  FormButtons,
  TextField,
  PasswordField,
  SubmitButton,
} from 'react-basics';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApi, useMessages } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { formatMessage, labels, getMessage } = useMessages();
  const router = useRouter();
  const { post, useMutation } = useApi();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: any) => post('/auth/login', data),
  });

  const handleSubmit = async (data: any) => {
    mutate(data, {
      onSuccess: async ({ token, user }) => {
        setClientAuthToken(token);
        setUser(user);

        router.push('/dashboard');
      },
    });
  };

  return (
    <div className={styles.login}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className={styles.logoImage}
            priority
          />
        </div>
        <h1 className={styles.title}>hivefinty</h1>
      </div>
      <Form className={styles.form} onSubmit={handleSubmit} error={getMessage(error)}>
        <FormRow label={formatMessage(labels.username)}>
          <FormInput
            data-test="input-username"
            name="username"
            rules={{ required: formatMessage(labels.required) }}
          >
            <TextField autoComplete="off" className={styles.input} />
          </FormInput>
        </FormRow>
        <FormRow label={formatMessage(labels.password)}>
          <FormInput
            data-test="input-password"
            name="password"
            rules={{ required: formatMessage(labels.required) }}
          >
            <PasswordField className={styles.input} />
          </FormInput>
        </FormRow>
        <FormButtons>
          <SubmitButton
            data-test="button-submit"
            className={styles.button}
            variant="primary"
            disabled={isPending}
          >
            {formatMessage(labels.login)}
          </SubmitButton>
        </FormButtons>
      </Form>
    </div>
  );
}

export default LoginForm;
