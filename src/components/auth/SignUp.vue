<template>
  <div class="signup-wrapper">
    <v-card elevation="9" shaped class="mx-auto my-12 sign-in-card" max-width="500">
      <p class="title">Sign Up</p>
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
              <div class="error-wrapper" v-for="err in getRegisterErrors.username" :key="err">
                <small >{{ err }}</small>
              </div>
            </v-col>

            <v-col
                cols="12"
                md="12"
            >
              <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  required
              ></v-text-field>
              <div class="error-wrapper" v-for="err in getRegisterErrors.email" :key="err">
                <small >{{ err }}</small>
              </div>
            </v-col>

            <v-col
                cols="12"
                md="12"
            >
              <v-text-field
                  type="password"
                  v-model="form.password"
                  :rules="passwordRule"
                  prepend-icon="mdi-lock"
                  :counter="8"
                  label="Password"
                  required
              ></v-text-field>
              <div class="error-wrapper" v-for="err in getRegisterErrors.password" :key="err">
                <small >{{ err }}</small>
              </div>
            </v-col>

            <v-col
                cols="12"
                md="4"
            >
              <v-btn
                  :disabled="!valid"
                  elevation="2"
                  @click="register"
              >Sign In
              </v-btn>
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
  name: 'sign-up',

  data: () => ({
    valid: false,
    form: {
      username: '',
      email: '',
      password: '',
    },
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    nameRules: [
      v => !!v || 'Name is required',
    ],
    passwordRule: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Name must be less than 10 characters',
    ],
  }),

  computed: {
    ...mapGetters(['getRegisterErrors', 'getErrorData'])
  },

  methods: {
    ...mapActions(['signup']),

    async register() {
      this.validateField()
      await this.signup(this.form)

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
.signup-wrapper {
  .sign-in-card {
    padding: 30px;

    .title {
      font-weight: bold;
    }

    .error-wrapper {
      small {
        margin-left: 32px;
        line-height: 12px;
        word-break: break-word;
        color: #ff5252;
      }
    }
  }
}
</style>