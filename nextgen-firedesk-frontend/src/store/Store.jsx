import { configureStore } from "@reduxjs/toolkit";
import CustomizerReducer from "./customizer/CustomizerSlice";
import ChatsReducer from "./apps/chat/ChatSlice";
import ContactsReducer from "./admin/masterData/state/StateSlice";
import { addCity } from "./admin/masterData/city/CitySlice";
import { CategorieSlice } from "./admin/masterData/categorie/CategorieSlice";
import user from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "firedesk",
  storage,
};

const persistedReducer = persistReducer(persistConfig, user);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    addCity: addCity,
    categorieSlice: CategorieSlice,
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    contactsReducer: ContactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
