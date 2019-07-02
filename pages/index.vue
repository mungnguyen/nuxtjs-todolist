<template>
  <div class="row">
    <div class="col-md-4 to-do-list">
      <div>
        <div v-for="item in list" :key="item.id" :item="item" style="margin-left: 1em">
          <div v-if="!item.tick">
            <font-awesome-icon @click="changeTick(item)" :icon="['far', 'circle']" />
            <span class="title">
              <b @click="chooseTodo(item.id)">{{ item.title }}</b>
            </span>
            <font-awesome-icon v-on:click="deleteTodo(item.id)" icon="trash" class="delete" />
            <hr />
          </div>
        </div>
      </div>

      <div>
        <div v-for="item in list" :key="item.id" :item="item" style="margin-left: 1em">
          <div v-if="item.tick" style="color: grey">
            <font-awesome-icon @click="changeTick(item)" :icon="['far', 'check-circle']" />
            <span class="title">
              <b @click="chooseTodo(item.id)">
                <strike>{{ item.title }}</strike>
              </b>
            </span>
            <font-awesome-icon v-on:click="deleteTodo(item.id)" icon="trash" class="delete" />
            <hr />
          </div>
        </div>
      </div>
      <center>
        <b-button pill v-b-modal.modal variant="outline-primary">Add new</b-button>
      </center>
      <!-- <vuejs-datepicker></vuejs-datepicker> -->
      <b-modal
        id="modal"
        ref="modal"
        :title="modalTitle"
        @show="resetModal"
        @hidden="reset"
        @ok="handleOk"
      >
        <form @submit.stop.prevent="handleSubmit">
          <b-form-group
            ref="titleForm"
            :state="titleState"
            label-cols-md="2"
            label="Tilte"
            label-for="title"
            invalid-feedback="Title is required"
          >
            <b-form-input id="title" v-model="title" :state="titleState" required></b-form-input>
          </b-form-group>

          <b-form-group
            ref="bodyForm"
            :state="bodyState"
            label-cols-md="2"
            label="Body"
            label-for="body"
            invalid-feedback="Body is required"
          >
            <b-form-input id="body" v-model="body" :state="bodyState" required></b-form-input>
          </b-form-group>

          <b-form-group
            ref="startDateForm"
            :state="startDateState"
            label-cols-md="2"
            label="Start: "
            label-for="startDate"
            invalid-feedback="Start date is invalid"
          >
            <date-picker
              id="startDate"
              v-model="startDate"
              :state="startDateState"
              required
              :config="{format: 'MM/DD/YYYY'}"
            ></date-picker>
          </b-form-group>
          <b-form-group
            ref="endDateForm"
            :state="endDateState"
            label-cols-md="2"
            label="End: "
            label-for="endDate"
            invalid-feedback="End date is invalid"
          >
            <date-picker
              id="endDate"
              v-model="endDate"
              :state="endDateState"
              required
              :config="{format: 'MM/DD/YYYY'}"
            ></date-picker>
          </b-form-group>
        </form>
      </b-modal>
      <div class="filter">
        <center>
          <b-button-group>
            <b-button @click="changeFilter('all')" variant="outline-primary">All</b-button>
            <b-button @click="changeFilter('completed')" variant="outline-secondary">Completed</b-button>
            <b-button @click="changeFilter('uncompleted')" variant="outline-success">Uncompleted</b-button>
          </b-button-group>
        </center>
      </div>
    </div>
    <div class="col-md-8" style="padding: 3em">
      <div v-if="todo">
        <p>
          <b>Title:</b>
          {{ todo[0].title }}
        </p>
        <br />

        <p>
          <b>Body:</b>
          {{ todo[0].body }}
        </p>
        <br />
        <p>
          <b>Start:</b>
          {{ todo[0].startDate | formatDate }}
        </p>
        <br />

        <p>
          <b>End:</b>
          {{ todo[0].endDate | formatDate }}
        </p>
        <br v-if="todo[0].tick" />
        <p v-if="todo[0].tick">
          <b>Done:</b>
          {{ todo[0].doneDate | formatDate }}
        </p>
        <b-button pill v-b-modal.modal variant="outline-primary" :pressed.sync="update">Update</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import { stat } from "fs";

export default {
  components: {},
  data: () => {
    return {
      filter: "all",
      title: "",
      titleState: null,
      body: "",
      bodyState: null,
      startDate: "",
      startDateState: "",
      endDate: "",
      endDateState: null,
      update: false,
      modalTitle: ""
      // now: moment().format("MM-DD-YYYY")
    };
  },

  computed: {
    ...mapState({
      list(state) {
        if (this.filter === "all") return state.todoModule.list;
        else if (this.filter === "completed")
          return state.todoModule.list.filter(item => item.tick);
        else if (this.filter === "uncompleted")
          return state.todoModule.list.filter(item => !item.tick);
      },

      todo(state) {
        return state.todoModule.todo;
      }
    })
  },

  methods: {
    chooseTodo(id) {
      this.$store.dispatch("getTodoById", id);
    },

    checkFormValidity() {
      const validTitle = this.title.length > 0 ? true : false;
      this.titleState = validTitle ? "valid" : "invalid";

      const validBody = this.body.length > 0 ? true : false;
      this.bodyState = validBody ? "valid" : "invalid";

      const end = moment(this.endDate).format("YYYY-MM-DD");
      const start = moment(this.startDate).format("YYYY-MM-DD");
      const now = moment().format("YYYY-MM-DD");

      const validStart = this.startDate ? true : false;
      this.startDateState = validStart ? "valid" : "invalid";

      console.log({ end, start, now, enDate: this.endDate });
      console.log(moment(end).isBefore(start));
      const validDate =
        !this.endDate ||
        moment(this.endDate).isBefore(now) ||
        moment(this.endDate).isBefore(this.startDate)
          ? false
          : true;
      this.endDateState = validDate ? "valid" : "invalid";

      return validTitle && validBody && validDate && validStart;
    },

    resetModal() {
      if (!this.update) {
        this.modalTitle = "Add new to-do";
        this.title = "";
        this.titleState = null;
        this.body = "";
        this.bodyState = null;
        (this.startDate = ""),
          (this.startDateState = null),
          (this.endDate = ""),
          (this.endDateState = null);
      } else {
        this.modalTitle = "Update to-do";
        this.title = this.$store.state.todoModule.todo[0].title;
        this.titleState = null;
        this.body = this.$store.state.todoModule.todo[0].body;
        this.bodyState = null;
        this.startDate = moment(this.$store.state.todoModule.todo[0].startDate);
        this.startDateState = null;
        this.endDate = moment(this.$store.state.todoModule.todo[0].endDate);
        this.endDateState = null;
      }
    },

    reset() {
      this.resetModal();
      this.update = false;
    },

    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
      this.update = false;
    },

    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      const todoChange = {
        title: this.title,
        body: this.body,
        startDate: moment(this.startDate).format("YYYY/MM/DD"),
        endDate: moment(this.endDate).format("YYYY/MM/DD")
      };
      if (this.update) {
        this.$store.dispatch("updateTodo", {
          ...todoChange,
          id: this.$store.state.todoModule.todo[0].id
        });
      } else {
        this.$store.dispatch("addTodo", todoChange);
      }

      // this.$refs.modal.hide();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },

    deleteTodo(id) {
      this.$store.dispatch("deleteTodo", id);
    },

    changeFilter(filte) {
      this.filter = filte;
    },

    changeTick(todo) {
      const changeTD = todo.tick
        ? {
            id: todo.id,
            tick: !todo.tick,
            doneDate: null
          }
        : {
            id: todo.id,
            tick: !todo.tick,
            doneDate: moment().format("YYYY/MM/DD")
          };
      this.$store.dispatch("updateTodo", changeTD);
    }
  },

  mounted() {
    this.$store.dispatch("getAllTodo");
  }
};
</script>

<style>
.to-do-list {
  border-right: 0.05em solid rgb(134, 131, 131);
  margin: 0;
  padding-top: 0.5em;
  padding-right: 0;
  height: 33.8em;
}

.title {
  margin-left: 2em;
  font: 1em sans-serif;
}

.delete {
  position: absolute;
  right: 1em;
  color: grey;
}

.delete:hover {
  color: black;
}

.filter {
  position: absolute;
  bottom: 1em;
  left: 5em;
}
</style>


