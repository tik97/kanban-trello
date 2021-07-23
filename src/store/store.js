import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
    state: {
        board: [
            {
                id: 0,
                name: "ON HOLD",
                show: false,
                tasks: []
            },
            {
                id: 1,
                name: "IN PROGRESS",
                show: false,
                tasks: []
            },
            {
                id: 2,
                name: "NEED REVIEW",
                show: false,
                tasks: []
            },
            {
                id: 3,
                name: "APPROVED",
                show: false,
                tasks: []
            },
        ],
        tasks: [],
        user: null,
        registerErrors: {
            email: null,
            username: null,
            password: null,
        },
        errorData: null
    },
    mutations: {
        setUserData(state, data) {
            state.user = data
            localStorage.setItem('userData', JSON.stringify(data));
            axios.defaults.headers.Authorization = `JWT ${data.token}`;
        },

        setErrors(state, data) {
            state.errorData = data
        },

        clearRegisterErrors(state, data) {
            state.registerErrors = data
            state.errorData = data
        },

        clearUserData(state) {
            localStorage.removeItem('userData');
            state.user = null
            axios.defaults.headers.Authorization = ''
        },

        setCreatedCard(state, data) {
            state.tasks = data
        },

        moveCard(state, data) {
            const { fromTask, toTasks, task } = data

            fromTask.splice(task, 1)
            toTasks.push(task)

            console.log(fromTask, "fromTask")
            console.log(toTasks, 'toTasks')
            console.log(task, "task")

        }
    },
    actions: {
        async signup ({ commit }, data) {
            await axios.post('/api/v1/users/create/', data)
                .then(res => {
                    commit('setUserData', res.data);
                    commit('clearRegisterErrors', null)
                })
                .catch(err => {
                    commit('setErrors', err.response.data)
                    for (const [key, value] of Object.entries(err.response.data)) {
                        switch (key) {
                            case "email":
                                this.state.store.registerErrors.email = value
                                break;
                            case "password":
                                this.state.store.registerErrors.password = value
                                break;
                            case "username":
                                this.state.store.registerErrors.username = value
                        }
                    }
                })
        },

        async signing ({ commit }, data) {
            await axios.post('/api/v1/users/login/', data)
                .then(res => {
                    commit('setUserData', res.data);
                    commit('clearRegisterErrors', null)
                })
                .catch(err => {
                    commit('setErrors', err.response.data)

                    for (const [key, value] of Object.entries(err.response.data)) {
                        if (key === "non_field_errors") {
                            this.state.store.errorData = value
                        }
                    }
                })
        },

        async getCards ({ commit }) {
            await axios.get("/api/v1/cards/")
                .then(res => commit("setCreatedCard", res.data))
                .catch(() => {
                    this.$router.push('/signing')
                    commit('clearUserData')
                })
        },

        async createCard ({ commit }, data) {
            await axios.post('/api/v1/cards/', data)
                .then(res => {
                    commit('setCreatedCard', res.data)
                })
        },

        async removeCard ({ commit }, id) {
            await axios.delete(`/api/v1/cards/${id}/`)
                .then(() => {
                    const filteredItems = this.state.store.board.filter(item => item.id !== id)
                    commit('setCreatedCard', filteredItems)
                })
        },

        async editCards ({ commit }, {currentTask, toTasks, fromTask}) {
            await axios.patch(`https://trello.backend.tests.nekidaem.ru/api/v1/cards/${currentTask.id}/`)
                .then(res => {
                    commit("moveCard", {task: res.data, toTasks, fromTask})
                })
        }
    },
    getters: {
        getRegisterErrors: state => state.registerErrors,
        getErrorData: state => state.errorData,
        getBoardData: state => state.board,
        getAllTasks: state => state.tasks
    }
}