import axios from "axios"

export default {
    namespaced: true,
    state: () => ({
        items: [],
    }),
    mutations: {
        set(state, items) {
            state.items = items.map((item) => ({
                id: item._id,
                ...item
            }))
        },
        delete(state, id) {
            const items = [ ...state.items];
            const idx = items.findIndex(item => item.id===id);
            items.splice(idx, 1);

            state.items = items;
        },
        add(state, { item, id }) {
            const items = [ ...state.items];
            items.push({ ...item, id });

            state.items = items;
        },
        update(state, { item, id }) {
            const items = [ ...state.items];
            const idx = items.findIndex(item => item.id===id);
            items[idx] = item;

            state.items = items;
        },
    },
    actions: {
        load ({ commit }) {
            axios.get(`/api/employees`)
                .then((response) => {
                    commit('set', response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        delete({ commit }, id) {
            axios.delete(`/api/employees/${id}`)
                .then((_) => {
                    commit('delete', id)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        add({ commit, state }, item) {
            axios.post('/api/employees', item).then(result => {
                commit('add', { item, id : result.data._id })
            })
        },
        update({ commit, state }, item) {
            const id = item.id
            axios.put(`/api/employees/${id}`, item).then(_ => {
                commit('update', {item , id })
            })
        },

    },
    getters: {},
}