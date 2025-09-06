import axios from '../../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = '/api/data/contacts/ContactsData';

const initialState = {
  contacts: [],
  contactContent: 1,
  contactSearch: '',
  editContact: false,
  currentFilter: 'show_all',
};

export const StateSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    getContacts: (state, action) => {
      state.contacts = action.payload;
    },
    SearchContact: (state, action) => {
      state.contactSearch = action.payload;
    },
    SelectContact: (state, action) => {
      state.contactContent = action.payload;
    },
    DeleteContact: (state, action) => {
      const index = state.contacts.findIndex((contact) => contact.id === action.payload);
      state.contacts.splice(index, 1);
    },
    toggleStarredContact: (state, action) => {
      state.contacts = state.contacts.map((contact) =>
        contact.id === action.payload ? { ...contact, starred: !contact.starred } : contact,
      );
    },
    isEdit: (state) => {
      state.editContact = !state.editContact;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    UpdateContact: {
      reducer: (state, action) => {
        state.contacts = state.contacts.map((contact) =>
          contact.id === action.payload.id
            ? { ...contact, [action.payload.field]: action.payload.value }
            : contact,
        );
      },
      prepare: (id, field, value) => {
        return {
          payload: { id, field, value },
        };
      },
    },
    addState: {
      reducer: (state, action) => {
        state.contacts.push(action.payload);
      },
      prepare: (
        id,
        state,
      ) => {
        return {
          payload: {
            id,
            state,
            frequentlycontacted: false,
            starred: false,
            deleted: false,
          },
        };
      },
    },
  },
});

export const {
  getContacts,
  SearchContact,
  isEdit,
  SelectContact,
  DeleteContact,
  toggleStarredContact,
  UpdateContact,
  addState,
  setVisibilityFilter,
} = StateSlice.actions;

export const fetchContacts = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getContacts(response.data));
  } catch (err) {
    throw new Error(err);
  }
};

export default StateSlice.reducer;
