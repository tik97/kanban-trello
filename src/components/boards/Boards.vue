<template>
  <div class="boards-wrapper">
    <div class="columns-wrapper" v-if="boards">
      <div class="column"
           v-for="column in boards"
           :key="column.id"
           :id="column.id"
           @dragover.prevent
           @drop.prevent="moveCard($event, column.tasks)"
      >
        <div class="column-name"><span>{{ column.name }} ({{ column.tasks.length }})</span></div>
        <div class="list-reset" v-if="column.tasks.length">
          <div class="task"
               v-for="(task) in column.tasks"
               :key="task.id"
               :id="task.id"
               draggable="true"
               @dragstart="pickupTask($event, task.id)"
          >
            <div>
              <div class="task-id" v-if="task.id"><span><b>id</b>: {{ task.id }}</span></div>
              <div class="task-name" v-if="task.text"><span><b>name</b>: {{ task.text }}</span></div>
            </div>
            <v-btn @click="deleteCard(task.id)" icon>
              <v-icon small color="grey">X</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="add-card-wrapper">
          <button class="add-btn-wrapper" @click="column.show = true">
            <v-icon color="grey">mdi-plus</v-icon>
            <p>Add Card</p>
          </button>
          <div class="add-card-wrap" v-if="column.show">
            <v-text-field
                v-model="cardText"
                label="Add Card"
                hide-details="auto"
            ></v-text-field>
            <div class="add-or-cancel">
              <v-btn class="grey darken-2" @click="addCard(column.id)">Add Card</v-btn>
              <v-btn @click="column.show = false" icon>
                <v-icon small color="grey">X</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: 'boards-page',

  data: () => ({
    cardText: '',
    boards: null
  }),

  async mounted() {
    await this.getCards()

    this.getAllTasks.forEach(task => {
      this.getBoardData.map(board => {
        if (board.id === +task.row) {
          board.tasks.push(task)
        }
      })
    })

    this.boards = this.getBoardData
  },

  methods: {
    ...mapActions(['getCards', 'createCard', 'removeCard', 'editCards']),

    async addCard(row) {
      const data = {row, text: this.cardText}
      await this.createCard(data)
      this.boards.map(item => {
        if (item.id === row) {
          item.show = false
        }
      })
      this.cardText = ''
    },

    async deleteCard(id) {
      await this.removeCard(id)
    },

    pickupTask(event, row) {
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.dropEffect = "move"

      event.dataTransfer.setData('row', row && row)
    },

    async moveCard(event, toTasks) {
      const currentTaskId = event.dataTransfer.getData("row");
      const currentTask = this.getAllTasks.find(task => task.id === +currentTaskId)
      const fromTask = this.boards.find(item => item).tasks
      await this.editCards({currentTask, toTasks, fromTask})
    }
  },

  computed: {
    ...mapGetters(['getBoardData', 'getAllTasks']),
  },
}
</script>

<style lang="scss" scoped>
.boards-wrapper {
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  color: white;

  .columns-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 20px;

    .column {
      width: calc(100% / 5);
      border-radius: 5px;
      padding: 10px;
      background-color: rgb(86, 86, 102);
      color: white;

      .column-name {
        background: orange;
        margin: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
    }

    .task {
      display: flex;
      justify-content: space-between;
      background: black;
      padding: 5px;
      margin-top: 15px;
      cursor: pointer;
    }

    .add-btn-wrapper {
      display: flex;
      margin-top: 20px;

      .add-card-wrap {
        display: flex;
      }
    }

    .add-or-cancel {
      margin-top: 15px;
    }
  }
}
</style>