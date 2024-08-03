// requests.js
import { ref } from 'vue';

const BASE_URL = 'https://windxtoxwest.online';

export const fetchNotices = async (province = '', type = '') => {
    const url = new URL(`${BASE_URL}/notices/list`);
    if (province) url.searchParams.append('province', province);
    if (type) url.searchParams.append('type', type);

    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        if (data.code === 0) {
            return data.data;
        } else {
            console.log('Failed to fetch notices:', data);
            // throw new Error('Failed to fetch notices');
        }
    } catch (error) {
        console.error('Error fetching notices:', error);
        return [];
    }
};

export const useNotices = () => {
    const notices = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const loadNotices = async (province = '', type = '') => {
        loading.value = true;
        error.value = null;
        try {
            notices.value = await fetchNotices(province, type);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    return { notices, loading, error, loadNotices };
};