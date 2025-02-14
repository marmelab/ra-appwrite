import { Client, Account, AppwriteException, type Models } from 'appwrite';
import { AuthProvider, UserIdentity } from 'react-admin';

const APPWRITE_USER_KEY = 'appwrite_user';

export type AppWriteAuthProviderParams = {
    client: Client;
};

export const appWriteAuthProvider = ({
    client,
}: AppWriteAuthProviderParams): AuthProvider => {
    const account = new Account(client);
    let session: Models.Session | null = null;
    return {
        async login(params: { email: string; password: string }) {
            const { email, password } = params;

            session = await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            localStorage.setItem(APPWRITE_USER_KEY, JSON.stringify(user));
        },

        async logout(): Promise<string | false | void> {
            localStorage.removeItem(APPWRITE_USER_KEY);
            if (!session) {
                return;
            }
            try {
                await account.deleteSession(session.$id);
            } catch (err: unknown) {
                const code = (err as AppwriteException).code;
                if (code !== 401) {
                    throw err;
                }
            }
        },

        async checkAuth(): Promise<void> {
            const localUser = localStorage.getItem(APPWRITE_USER_KEY);
            if (!localUser) {
                throw new Error();
            }
        },

        async checkError(error: AppwriteException): Promise<void> {
            const { code } = error;
            if (code === 401 || code === 403) {
                localStorage.removeItem(APPWRITE_USER_KEY);
                throw new Error();
            }
        },

        async getIdentity(): Promise<UserIdentity> {
            let user: Models.User<Models.Preferences> | null = null;

            const localUser = localStorage.getItem(APPWRITE_USER_KEY);
            if (localUser) {
                user = JSON.parse(localUser);
            } else {
                user = await this.client.account.get();
            }

            return {
                id: user?.$id || '',
                fullName: user?.name,
                // avatar: ''
                ...user,
            };
        },
    };
};
