// 存储用户选择的三级参数id
export default new Vuex.Store({
    namespaced: true,
    state: {
        attr_id: 0
    },
    mutations: {
        getAttr_IdMut(state, id) {
            state.attr_id = id
        }
    },
})