import { createSlice } from '@reduxjs/toolkit';
import { Entry } from '../../interfaces/entry.interface';

const entries = createSlice({
    name: 'entry',
    initialState: [] as Entry[],
    reducers: {
        setEntries(state, action) {
            return state = (action.payload !== null) ? action.payload : [];
        },
        updateEntry(state, action) {
            const { id } = action.payload;
            const entryIndex = state.findIndex((e) => e.id === id);
            if (entryIndex !== null) {
                state.splice(entryIndex, 1, action.payload);
            }
        }
    }
});

export const { setEntries, updateEntry } = entries.actions;
export default entries.reducer;