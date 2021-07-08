import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../interfaces/user.interface';

const user = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        setUser(state, action) {
            return state = (action.payload) ? action.payload : null;
        }
    }
});

export const { setUser } = user.actions;
export default user.reducer;