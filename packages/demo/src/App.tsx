import {
    Admin,
    LoginWithEmail,
    Resource,
    ListGuesser,
    EditGuesser,
} from 'react-admin';
import { Client } from 'appwrite';
import { appWriteDataProvider, appWriteAuthProvider } from 'ra-appwrite';

import contacts from './contacts';

const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECTID);
const dataProvider = appWriteDataProvider({
    client,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASEID,
    collectionIds: JSON.parse(import.meta.env.VITE_APPWRITE_COLLECTIONIDS),
});
const authProvider = appWriteAuthProvider({ client });

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginWithEmail}
    >
        <Resource name="contacts" {...contacts} />
        <Resource name="companies" list={ListGuesser} edit={EditGuesser} />
    </Admin>
);

export default App;
