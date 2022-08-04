import axios from "axios"

export default {
    namespaced: true,
    state: () => ({
        items: [],
        paginate: {
            page: 1,
            limit: 10,
            totalPages: 0,
            totalDocs: 0
        }
    }),
    mutations: {
        set(state, data) {

            const {docs, ...paginate} = data

            state.items = docs.map((item) => ({
                id: item._id,
                ...item
            }))

            state.paginate = paginate
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
        load ({ commit }, options) {
            return axios.get(`/api/employees?${new URLSearchParams(options)}`)
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