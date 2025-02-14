import * as React from 'react';
import type { ComponentProps } from 'react';
import { CardActions, styled } from '@mui/material';
import {
    Form,
    required,
    useLogin,
    useNotify,
    useTranslate,
    PasswordInput,
    SaveButton,
    TextInput,
} from 'react-admin';

/**
 * A component that renders a form to login to the application with an email and password.
 *
 * @example
 * import { Admin, Login } from 'react-admin';
 * import { appWriteAuthProvider, LoginForm } from 'ra-appwrite';
 *
 * const LoginPage = () => <Login><LoginForm/></Login>;
 * const App = () => (
 *    <Admin loginPage={LoginPage} authProvider={authProvider}>
 *       ...
 *    </Admin>
 * );
 */
export const LoginForm = ({
    disableForgotPassword,
    ...props
}: LoginFormProps) => {
    const login = useLogin();
    const notify = useNotify();
    const translate = useTranslate();

    const submit = (values: FormData) => {
        return login(values).catch(error => {
            notify(
                typeof error === 'string'
                    ? error
                    : typeof error === 'undefined' || !error.message
                    ? 'ra.auth.sign_in_error'
                    : error.message,
                {
                    type: 'warning',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
        });
    };

    return (
        <Root onSubmit={submit} {...props}>
            <div className={AppWriteLoginFormClasses.container}>
                <div className={AppWriteLoginFormClasses.input}>
                    <TextInput
                        autoFocus
                        source="email"
                        type="email"
                        label={translate('ra-appwrite.auth.email', {
                            _: 'Email',
                        })}
                        fullWidth
                        validate={required()}
                    />
                </div>
                <div>
                    <PasswordInput
                        source="password"
                        label={translate('ra.auth.password', {
                            _: 'Password',
                        })}
                        autoComplete="current-password"
                        fullWidth
                        validate={required()}
                    />
                </div>
            </div>
            <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
                <SaveButton
                    variant="contained"
                    type="submit"
                    className={AppWriteLoginFormClasses.button}
                    label={translate('ra.auth.sign_in')}
                    icon={<></>}
                />
            </CardActions>
        </Root>
    );
};

export interface LoginFormProps
    extends Omit<ComponentProps<typeof Root>, 'onSubmit' | 'children'> {
    disableForgotPassword?: boolean;
}

interface FormData {
    email?: string;
    password?: string;
}

const PREFIX = 'RaAppWriteLoginForm';

const AppWriteLoginFormClasses = {
    container: `${PREFIX}-container`,
    input: `${PREFIX}-input`,
    button: `${PREFIX}-button`,
};

const Root = styled(Form, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${AppWriteLoginFormClasses.container}`]: {
        padding: '0 1em 1em 1em',
    },
    [`& .${AppWriteLoginFormClasses.input}`]: {
        marginTop: '1em',
    },
    [`& .${AppWriteLoginFormClasses.button}`]: {
        width: '100%',
    },
}));
