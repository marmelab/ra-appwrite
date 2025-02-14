import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    DateInput,
} from 'react-admin';

const ContactList = () => (
    <List
        filters={[
            <TextInput source="first_name" />,
            <TextInput source="last_name" />,
        ]}
    >
        <Datagrid>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceField source="company.$id" reference="companies" />
            <DateField source="$createdAt" />
            <DateField source="$updatedAt" />
        </Datagrid>
    </List>
);

const ContactEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <DateInput source="$createdAt" />
            <DateInput source="$updatedAt" />
        </SimpleForm>
    </Edit>
);

const ContextCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <DateInput source="$createdAt" />
            <DateInput source="$updatedAt" />
        </SimpleForm>
    </Create>
);

const ContactShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceField source="company.$id" reference="companies" />
            <DateField source="$createdAt" />
            <DateField source="$updatedAt" />
        </SimpleShowLayout>
    </Show>
);

type Contact = {
    id: string;
    first_name?: string;
    last_name?: string;
    company?: {
        $id: string;
    };
    $createdAt: string;
    $updatedAt: string;
};

const contactResource = {
    list: ContactList,
    edit: ContactEdit,
    create: ContextCreate,
    show: ContactShow,
    recordRepresentation: (record: Contact) =>
        `${record.first_name} ${record.last_name}`,
};

export default contactResource;
