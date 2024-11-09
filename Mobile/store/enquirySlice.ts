import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enquiry } from '../services/api/enquiry';

interface EnquiryData {
    name: string;
    email: string;
    mobile: string;
    comment: string;
}

interface EnquiryResponse {
    success: boolean;
    message: string;
}

interface EnquiryState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: EnquiryState = {
    loading: false,
    error: null,
    success: false,
};

export const submitEnquiry = createAsyncThunk<
    EnquiryResponse,
    EnquiryData,
    {
        rejectValue: string;
    }
>(
    'enquiry/submitEnquiry',
    async (userData: EnquiryData, { rejectWithValue }) => {
        try {
            const response = await enquiry(userData);
            if (response.data.success !== undefined) {
                return response.data as EnquiryResponse;
            } else {
                if (response.status >= 200 && response.status < 300) {
                    return { success: true, message: 'Enquiry submitted successfully.' };
                } else {
                    return rejectWithValue('Submission failed.');
                }
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message || 'Something went wrong');
        }
    }
);

const enquirySlice = createSlice({
    name: 'enquiry',
    initialState,
    reducers: {
        resetEnquiryState(state) {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitEnquiry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitEnquiry.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
            })
            .addCase(submitEnquiry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { resetEnquiryState } = enquirySlice.actions;

export default enquirySlice.reducer;
