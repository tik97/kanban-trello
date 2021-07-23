<template>
  <div class="signing-wrapper">
    <v-card elevation="9" shaped class="mx-auto my-12 sign-in-card" max-width="500">
      <p class="title">Sign In</p>

      <v-container>
        <v-flex>
          <v-form ref="form" v-model="valid" lazy-validation>

          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                v-model="form.username"
                :rules="nameRules"
                label="User name"
                prepend-icon="mdi-account"
                required
            ></v-text-field>
          </v-col>

          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                v-model="form.password"
                type="password"
                :rules="passwordRule"
                :counter="8"
                label="Password"
                prepend-icon="mdi-lock"
                required
            ></v-text-field>
            <small v-if="getErrorData">{{ getErrorData[0] }}</small>
          </v-col>

          <v-col
              cols="12"
              md="4"
          >
            <v-btn
                elevation="2"
                @click="login"
            >Sign In</v-btn>
          </v-col>

          </v-form>
        </v-flex>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'sign-in',

  data: () => ({
    valid: false,
    form: {
      username: '',
      password: '',
    },
    nameRules: [
      v => !!v || 'Name is required',
    ],
    passwordRule: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Name must be less than 10 characters',
    ],
  }),

  computed: {
    ...mapGetters(['getErrorData'])
  },

  methods: {
    ...mapActions(['signing']),

    async login() {
      this.validateField()
      await this.signing(this.form)

      if (!this.getErrorData) {
        await this.$router.push('/')
      }
    },

    validateField () {
      this.$refs.form.validate()
      this.valid = false
    },
  }
}
</script>

<style lang="scss" scoped>
.signing-wrapper {

  .sign-in-card {
    padding: 30px;

    .title {
      font-weight: bold;
    }

    small {
      margin-left: 32px;
      line-height: 12px;
      word-break: break-word;
      color: #ff5252;
    }
  }
}
</style>