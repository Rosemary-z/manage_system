// 存储用户选择的三级参数id
export default {
    namespaced: true,
    state: {
        attr_id: ''
    },
    mutations: {
        getAttr_IdMut(state, id) {
            state.attr_id = id
        }
    },
}